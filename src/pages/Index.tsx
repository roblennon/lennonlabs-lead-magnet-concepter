import { useState, useEffect } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

  const subscribeToConvertKit = async (email: string, data: FormData, pdfUrl: string) => {
    try {
      const { error } = await supabase.functions.invoke('subscribe-convertkit', {
        body: { 
          email,
          fields: {
            offer_desc: data.offer,
            lead_magnet: "Lead Magnet Generator",
            lead_magnet_link: pdfUrl
          }
        }
      });

      if (error) throw error;
      console.log('Successfully subscribed to ConvertKit');
    } catch (error) {
      console.error('Error subscribing to ConvertKit:', error);
      toast({
        title: "Newsletter Subscription Error",
        description: "Failed to subscribe to the newsletter, but your analysis was generated.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAnalysis(undefined);
    
    try {
      const { data: savedAnalysis, error: dbError } = await supabase
        .from('revenue_analyses')
        .insert({
          email: data.email,
          offer: data.offer,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const { data: aiConfig, error: configError } = await supabase
        .from('ai_configs')
        .select()
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (configError) throw configError;

      const response = await supabase.functions.invoke('analyze-revenue', {
        body: { 
          analysisId: savedAnalysis.id,
          prompt: aiConfig.prompt,
          model: aiConfig.model,
          temperature: aiConfig.temperature,
          data
        }
      });

      if (response.error) throw response.error;

      if (response.data?.usingFallback) {
        toast({
          title: "AI Model Fallback",
          description: "Initial AI is overloaded or failed. Trying a different model.",
        });
      }

      if (response.data?.content) {
        setAnalysis(response.data.content);
        
        const timestamp = new Date().getTime();
        const filename = `analysis-${timestamp}.pdf`;
        const element = document.getElementById('analysis-content');
        
        if (element) {
          const pdf = await html2pdf().set({
            margin: 1,
            filename: 'lead-magnet-ideas.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
              scale: 1.5,
              useCORS: true,
              letterRendering: true
            },
            jsPDF: { 
              unit: 'in', 
              format: 'letter', 
              orientation: 'portrait',
              compress: true,
              precision: 3
            }
          }).from(element).output('blob');

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('analysis-pdfs')
            .upload(filename, pdf, {
              contentType: 'application/pdf',
              cacheControl: '15780000'
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('analysis-pdfs')
            .getPublicUrl(filename);

          await subscribeToConvertKit(data.email, data, publicUrl);
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