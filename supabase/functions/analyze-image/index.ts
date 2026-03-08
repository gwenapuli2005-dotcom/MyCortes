import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an image forensics expert. Analyze this image and determine if it appears to be AI-generated or a real photograph. Consider:
1. Unnatural details (extra fingers, distorted text, impossible shadows, warped geometry)
2. Texture consistency and lighting coherence
3. Background coherence and depth-of-field accuracy
4. Edge artifacts, blending issues, and repeating patterns
5. Skin/surface texture unnaturalness
6. Signs of image manipulation or compositing

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{"isReal": true, "confidence": 85, "analysis": "Brief 1-2 sentence explanation"}

Where isReal is true (authentic photo), false (AI-generated/manipulated), or null (uncertain).
Confidence is 0-100. Analysis is a brief explanation.`
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response, handling markdown code blocks
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```(?:json)?\n?/g, "").trim();
    }

    try {
      const parsed = JSON.parse(cleaned);
      return new Response(JSON.stringify({
        isReal: parsed.isReal,
        confidence: parsed.confidence || 50,
        analysis: parsed.analysis || "Unable to determine",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({
        isReal: null,
        confidence: 50,
        analysis: content.slice(0, 200),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("analyze-image error:", error);
    return new Response(JSON.stringify({ error: error.message || "Analysis failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
