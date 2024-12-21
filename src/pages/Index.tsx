import { useState, useEffect } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SalesContent from "@/components/layout/SalesContent";
import { generateAnalysis } from "@/services/analysisService";
import { subscribeToConvertKit } from "@/services/convertKitService";
import { generateAndUploadPDF } from "@/services/pdf/pdfService";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>();
  const [initialEmail, setInitialEmail] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setInitialEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (data: FormData) => {
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
      setIsLoading(false); // Set loading to false after analysis is generated
      
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
      setIsLoading(false); // Also ensure loading is set to false on error
      toast({
        title: "Error",
        description: "Failed to generate lead magnet ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-card rounded-lg shadow-lg border border-border/30">
            <RevenueForm onSubmit={handleSubmit} isLoading={isLoading} initialEmail={initialEmail} />
          </div>
          <div className="lg:col-span-7 bg-card rounded-lg shadow-lg border border-border/30">
            <AnalysisPanel isLoading={isLoading} analysis={analysis} />
          </div>
        </div>
      </main>
      <SalesContent />
      <Footer />
    </div>
  );
};

export default Index;