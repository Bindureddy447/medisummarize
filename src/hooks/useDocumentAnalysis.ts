import { useState } from 'react';
import { AnalysisResult } from '@/types/analysis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDocumentAnalysis = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadTimestamp, setUploadTimestamp] = useState<string>('');
  const { toast } = useToast();

  const analyze = async (documentText: string) => {
    if (!documentText.trim()) {
      toast({ title: "No content", description: "Please provide document text.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setAnalysisResult(null);
    const timestamp = new Date().toISOString();
    setUploadTimestamp(timestamp);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { documentText }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysisResult(data);
      toast({ title: "Analysis complete", description: "Your document has been analyzed successfully." });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: "Error", description: "Failed to analyze document. Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setAnalysisResult(null);
    setUploadTimestamp('');
  };

  return { isProcessing, analysisResult, uploadTimestamp, analyze, reset };
};
