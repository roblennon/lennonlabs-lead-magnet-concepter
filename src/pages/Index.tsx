import { useState, useEffect } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>();
  const [initialEmail, setInitialEmail] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Get email from URL query parameter
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
      // First, save the analysis request to the database
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

      // Get the active AI config
      const { data: aiConfig, error: configError } = await supabase
        .from('ai_configs')
        .select()
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (configError) throw configError;

      // Send data for analysis
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

      // Handle the response data
      if (response.data?.content) {
        setAnalysis(response.data.content);
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
        <div className="container mx-auto px-8 py-8">
          <h1 className="text-[2.5rem] font-bold text-primary mb-3">3-Minute Revenue Opportunity Finder</h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Drop in your website URL or paste your primary offer, and answer two quick questions.
            Our AI analysis will identify your fastest path to increased revenue.
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow-lg border border-border/30">
            <RevenueForm onSubmit={handleSubmit} isLoading={isLoading} initialEmail={initialEmail} />
          </div>
          <div className="bg-card rounded-lg shadow-lg border border-border/30">
            <AnalysisPanel isLoading={isLoading} analysis={analysis} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/30 py-6">
        <div className="container mx-auto px-8">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" 
              alt="Lennon Labs Logo" 
              className="h-8 w-8"
            />
            <span className="text-sm text-muted">lennonlabs.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;