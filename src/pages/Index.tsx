import { RevenueForm, FormData } from "@/components/RevenueForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SalesContent from "@/components/layout/SalesContent";
import { useAnalysisGeneration } from "@/hooks/useAnalysisGeneration";
import { useInitialEmail } from "@/hooks/useInitialEmail";

const Index = () => {
  const { isLoading, analysis, generateContent } = useAnalysisGeneration();
  const initialEmail = useInitialEmail();

  const handleSubmit = async (data: FormData) => {
    await generateContent(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-card rounded-lg shadow-lg border border-border/30">
            <RevenueForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              initialEmail={initialEmail} 
            />
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