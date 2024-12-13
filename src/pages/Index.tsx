import { useState } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>();
  const [stream, setStream] = useState<ReadableStream | undefined>();
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAnalysis(undefined);
    setStream(undefined);
    
    try {
      // If the offer field contains a URL, scrape it first
      if (data.offer.startsWith('http') && data.offer.includes('.')) {
        const { data: scrapedData, error: scrapeError } = await supabase.functions.invoke('scrape-url', {
          body: { url: data.offer }
        });

        if (scrapeError) throw scrapeError;
        if (scrapedData.content) {
          data.offer = scrapedData.content;
        }
      }

      // Send data for analysis and get stream
      const response = await supabase.functions.invoke('analyze-revenue', {
        body: data,
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      if (response.error) throw response.error;

      // Set the stream for the AnalysisPanel
      setStream(response.data as ReadableStream);
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
            <RevenueForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <div className="bg-card rounded-lg shadow-lg border border-border/30">
            <AnalysisPanel isLoading={isLoading} analysis={analysis} stream={stream} />
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