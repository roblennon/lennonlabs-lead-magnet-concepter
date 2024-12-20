import { useState, useEffect } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generateAnalysis } from "@/services/analysisService";
import { subscribeToConvertKit } from "@/services/convertKitService";
import { generateAndUploadPDF } from "@/utils/pdfGeneration";

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
      const response = await generateAnalysis(data);

      if (response?.usingFallback) {
        toast({
          title: "AI Model Fallback",
          description: "Initial AI is overloaded or failed. Trying a different model.",
        });
      }

      if (response?.content) {
        setAnalysis(response.content);
        
        try {
          const element = document.getElementById('analysis-content');
          if (element) {
            const publicUrl = await generateAndUploadPDF(element, data);
            if (publicUrl) {
              await subscribeToConvertKit(data.email, data, publicUrl);
            }
          }
        } catch (pdfError) {
          console.error('PDF/ConvertKit Error:', pdfError);
          toast({
            title: "PDF Generation Issue",
            description: "Your analysis was generated but we couldn't create the PDF. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate lead magnet ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

      <Footer />
    </div>
  );
};

export default Index;