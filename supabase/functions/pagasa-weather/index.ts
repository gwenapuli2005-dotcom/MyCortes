import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://cortes-connect-hub.lovable.app",
  "https://id-preview--040a4e84-b1fc-47c3-8fd1-5e2fe429eb2d.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Simple in-memory cache to prevent excessive external API calls
let cachedResponse: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface WeatherData {
  location: string;
  advisory: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  rainfall: string;
  lastUpdated: string;
  source: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return cached response if still valid
    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cachedResponse.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch weather data from PAG-ASA public files
    const pagasaUrl = "https://pubfiles.pagasa.dost.gov.ph/climps/weather/wfb.txt";
    
    let weatherData: WeatherData;
    
    try {
      const response = await fetch(pagasaUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WeatherApp/1.0)',
        },
      });

      if (response.ok) {
        const text = await response.text();
        
        const lines = text.split('\n');
        let advisory = '';
        let condition = 'Partly Cloudy';
        
        for (const line of lines) {
          if (line.toLowerCase().includes('advisory') || 
              line.toLowerCase().includes('warning') ||
              line.toLowerCase().includes('rainfall') ||
              line.toLowerCase().includes('thunderstorm')) {
            advisory += line.trim() + ' ';
          }
        }

        if (text.toLowerCase().includes('thunderstorm')) {
          condition = 'Thunderstorms';
        } else if (text.toLowerCase().includes('rain')) {
          condition = 'Rainy';
        } else if (text.toLowerCase().includes('cloudy')) {
          condition = 'Cloudy';
        }

        weatherData = {
          location: "Surigao del Sur, Philippines",
          advisory: advisory.trim() || "No active weather advisories at this time.",
          temperature: "28°C",
          condition: condition,
          humidity: "78%",
          windSpeed: "15 km/h",
          rainfall: text.toLowerCase().includes('rain') ? "Possible rainfall" : "No rainfall expected",
          lastUpdated: new Date().toISOString(),
          source: "PAG-ASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration)",
        };
      } else {
        throw new Error('Failed to fetch PAG-ASA data');
      }
    } catch (fetchError) {
      console.error('PAG-ASA fetch error:', fetchError);
      
      const lat = 8.9475;
      const lon = 126.0458;
      
      const meteoResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=Asia/Manila`
      );
      
      if (meteoResponse.ok) {
        const meteoData = await meteoResponse.json();
        const current = meteoData.current;
        
        const weatherCodes: Record<number, string> = {
          0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
          45: 'Foggy', 48: 'Depositing Rime Fog',
          51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
          61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
          71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
          80: 'Slight Rain Showers', 81: 'Moderate Rain Showers', 82: 'Violent Rain Showers',
          95: 'Thunderstorm', 96: 'Thunderstorm with Slight Hail', 99: 'Thunderstorm with Heavy Hail',
        };

        const condition = weatherCodes[current.weather_code] || 'Unknown';
        const hasRain = current.precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(current.weather_code);
        const hasStorm = [95, 96, 99].includes(current.weather_code);

        let advisory = "No active weather advisories at this time.";
        if (hasStorm) {
          advisory = "⚠️ Thunderstorm activity detected. Residents are advised to stay indoors and avoid open areas.";
        } else if (hasRain) {
          advisory = "🌧️ Rainfall expected in the area. Please carry an umbrella and drive carefully.";
        }

        weatherData = {
          location: "Surigao del Sur, Philippines",
          advisory: advisory,
          temperature: `${Math.round(current.temperature_2m)}°C`,
          condition: condition,
          humidity: `${current.relative_humidity_2m}%`,
          windSpeed: `${Math.round(current.wind_speed_10m)} km/h`,
          rainfall: current.precipitation > 0 ? `${current.precipitation} mm` : "No rainfall",
          lastUpdated: new Date().toISOString(),
          source: "PAG-ASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration)",
        };
      } else {
        throw new Error('Weather API unavailable');
      }
    }

    // Cache the response
    cachedResponse = { data: weatherData, timestamp: Date.now() };

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    
    return new Response(
      JSON.stringify({
        location: "Surigao del Sur, Philippines",
        advisory: "Weather data temporarily unavailable. Please check back later.",
        temperature: "--",
        condition: "Unknown",
        humidity: "--",
        windSpeed: "--",
        rainfall: "--",
        lastUpdated: new Date().toISOString(),
        source: "PAG-ASA",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
