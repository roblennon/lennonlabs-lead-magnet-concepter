import { useState, useEffect } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

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
            ppl_ask_help_with: data.helpRequests,
            primary_revenue_from: data.revenueSource,
            lead_magnet: "Fastest Path to Revenue",
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
          revenue_source: data.revenueSource,
          help_requests: data.helpRequests,
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
        
        // Generate PDF and get its URL
        const timestamp = new Date().getTime();
        const filename = `analysis-${timestamp}.pdf`;
        const element = document.getElementById('analysis-content');
        
        if (element) {
          const pdf = await html2pdf().set({
            margin: 1,
            filename: 'revenue-analysis.pdf',
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

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('analysis-pdfs')
            .upload(filename, pdf, {
              contentType: 'application/pdf',
              cacheControl: '15780000'
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('analysis-pdfs')
            .getPublicUrl(filename);

          // Subscribe to ConvertKit with the PDF URL
          await subscribeToConvertKit(data.email, data, publicUrl);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/30">
        <div className="container mx-auto px-8 py-8 text-center">
          <h1 className="text-[2.5rem] font-bold text-primary mb-3">Your Fastest Path to Cash</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Drop in your website URL or paste your primary offer, and answer two quick questions.
            Our AI analysis will identify your fastest path to increased revenue.
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-5 bg-card rounded-lg shadow-lg border border-border/30">
            <RevenueForm onSubmit={handleSubmit} isLoading={isLoading} initialEmail={initialEmail} />
          </div>
          <div className="col-span-7 bg-card rounded-lg shadow-lg border border-border/30">
            <AnalysisPanel isLoading={isLoading} analysis={analysis} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/30 py-6">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center space-x-2">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by Rob Lennon |</span>
            <a 
              href="https://lennonlabs.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              lennonlabs.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
