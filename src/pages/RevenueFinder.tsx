import { useState, useEffect } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormConfig, FormFields, ButtonConfig } from "@/types/database";

const RevenueFinder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>();
  const [formConfig, setFormConfig] = useState<FormConfig>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('form_configs')
          .select('*')
          .eq('slug', 'revenue')
          .eq('is_active', true)
          .single();

        if (error) throw error;
        
        // Transform and validate the data to match our TypeScript interface
        const fields = data.fields as FormFields;
        const buttonConfig = data.button_config as ButtonConfig;
        
        if (!fields || !buttonConfig) {
          throw new Error('Invalid form configuration');
        }
        
        setFormConfig({
          id: data.id,
          slug: data.slug,
          title: data.title,
          description: data.description,
          fields,
          buttonConfig,
          promptId: data.prompt_id,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } catch (error) {
        console.error('Error fetching form config:', error);
        toast({
          title: "Error",
          description: "Failed to load form configuration.",
          variant: "destructive",
        });
      }
    };

    fetchFormConfig();
  }, [toast]);

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
          prompt_id: formConfig?.promptId
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

  if (!formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading...</h2>
          <p className="text-muted">Please wait while we load the form configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/30">
        <div className="container mx-auto px-8 py-8">
          <h1 className="text-[2.5rem] font-bold text-primary mb-3">{formConfig.title}</h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            {formConfig.description}
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow-lg border border-border/30">
            <RevenueForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
              config={formConfig}
            />
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

export default RevenueFinder;