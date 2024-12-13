import { useState } from "react";
import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>();

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAnalysis(
      `Based on your inputs, here are your revenue opportunities:\n\n` +
      `1. Quick Wins:\n` +
      `• Optimize your ${data.revenueSource} offering\n` +
      `• Create a streamlined onboarding process\n` +
      `• Implement automated follow-ups\n\n` +
      `2. Growth Opportunities:\n` +
      `• Develop complementary products\n` +
      `• Create strategic partnerships\n` +
      `• Implement referral systems\n\n` +
      `3. Next Steps:\n` +
      `• Review your current pricing strategy\n` +
      `• Analyze your customer journey\n` +
      `• Identify automation opportunities`
    );
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-primary mb-3">3-Minute Revenue Opportunity Finder</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Drop in your website URL or paste your primary offer, and answer two quick questions.
            Our AI analysis will identify your fastest path to increased revenue.
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-240px)]">
          <div className="bg-card rounded-lg shadow-lg overflow-auto border border-border/30">
            <RevenueForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border/30">
            <AnalysisPanel isLoading={isLoading} analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;