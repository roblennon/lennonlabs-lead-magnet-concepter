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

      // Check if using fallback model
      if (response.data?.usingFallback) {
        toast({
          title: "AI Model Fallback",
          description: "Initial AI is overloaded or failed. Trying a different model.",
        });
      }

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
        <div className="container mx-auto px-8 py-8 text-center">
          <h1 className="text-[2.5rem] font-bold text-primary mb-3">3-Minute Revenue Opportunity Finder</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Drop in your website URL or paste your primary offer, and answer two quick questions.
            Our AI analysis will identify your fastest path to increased revenue.
          </p>
          
          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border/30 inline-block text-left">
            <p className="font-medium mb-2">Your Fastest Paths to Revenue:</p>
            <ul className="text-muted space-y-1">
              <li>Imposter Syndrome Mini-Course</li>
              <li>Content Idea Generator Tool</li>
              <li>"Hook of the Day" Email Series</li>
            </ul>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-5 bg-card rounded-lg shadow-lg border border-border/30 h-fit">
            <RevenueForm onSubmit={handleSubmit} isLoading={isLoading} initialEmail={initialEmail} />
          </div>
          <div className="col-span-7 bg-card rounded-lg shadow-lg border border-border/30">
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
            <a 
              href="https://lennonlabs.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-muted hover:text-primary transition-colors"
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