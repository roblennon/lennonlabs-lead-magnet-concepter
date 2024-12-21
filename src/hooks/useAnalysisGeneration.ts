import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateAnalysis } from "@/services/analysisService";
import { subscribeToConvertKit } from "@/services/convertKitService";
import { generateAndUploadPDF } from "@/services/pdf/pdfService";
import type { FormData } from "@/components/RevenueForm";

export const useAnalysisGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>();
  const { toast } = useToast();

  const generateContent = async (data: FormData) => {
    setIsLoading(true);
    setAnalysis(undefined);
    
    try {
      console.log("Starting analysis generation...");
      const response = await generateAnalysis(data);

      if (response?.usingFallback) {
        toast({
          title: "AI Model Fallback",
          description: "Initial AI is overloaded or failed. Trying a different model.",
        });
      }

      if (!response?.content) {
        throw new Error('No analysis content received from the server');
      }

      console.log("Analysis generated successfully");
      setAnalysis(response.content);
      setIsLoading(false);
      
      // Use a MutationObserver to wait for the analysis content to be fully rendered
      const waitForElement = () => {
        return new Promise((resolve) => {
          const observer = new MutationObserver((mutations, obs) => {
            const element = document.getElementById('analysis-content');
            if (element) {
              obs.disconnect();
              resolve(element);
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      };
      
      try {
        console.log("Waiting for analysis content to render...");
        const element = await waitForElement();
        console.log("Analysis content found in DOM, starting PDF generation...");
        
        const publicUrl = await generateAndUploadPDF(element as HTMLElement, 'revenue-analysis');
        console.log("PDF generated and uploaded successfully:", publicUrl);
        
        if (!publicUrl) {
          throw new Error('PDF URL is empty or invalid');
        }

        console.log("Starting ConvertKit subscription process...");
        const convertKitResponse = await subscribeToConvertKit(data.email, data, publicUrl);
        console.log("ConvertKit subscription completed:", convertKitResponse);
        
      } catch (pdfError) {
        console.error('PDF/ConvertKit Error:', pdfError);
        toast({
          title: "PDF Generation Issue",
          description: "Your analysis was generated but we couldn't create the PDF. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate lead magnet ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    analysis,
    generateContent
  };
};