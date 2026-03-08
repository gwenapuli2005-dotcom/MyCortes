import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ScanSearch, CheckCircle, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageAnalysisProps {
  imageUrl: string;
  className?: string;
}

interface AnalysisResult {
  isReal: boolean | null;
  confidence: number;
  analysis: string;
}

export const ImageAnalysis = ({ imageUrl, className }: ImageAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: { imageUrl },
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error('Failed to analyze image');
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult({
        isReal: data.isReal,
        confidence: data.confidence || 50,
        analysis: data.analysis || 'Unable to determine',
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={analyzeImage}
        disabled={isAnalyzing}
        className="w-full gap-2 border-primary/30 hover:bg-primary/5"
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-primary" />
        )}
        {isAnalyzing ? 'AI is analyzing image...' : 'Verify Image Authenticity'}
      </Button>

      {result && (
        <Card className={cn(
          "border-2 transition-all animate-slide-up",
          result.isReal === true && "border-success/50 bg-success/5",
          result.isReal === false && "border-destructive/50 bg-destructive/5",
          result.isReal === null && "border-muted"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {result.isReal === true && (
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              )}
              {result.isReal === false && (
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              )}
              {result.isReal === null && (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">
                  {result.isReal === true && '✅ Likely Authentic Photo'}
                  {result.isReal === false && '⚠️ Possibly AI-Generated'}
                  {result.isReal === null && '❓ Inconclusive'}
                </p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{result.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        result.isReal === true && "bg-success",
                        result.isReal === false && "bg-destructive",
                        result.isReal === null && "bg-muted-foreground"
                      )}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {result.analysis}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
