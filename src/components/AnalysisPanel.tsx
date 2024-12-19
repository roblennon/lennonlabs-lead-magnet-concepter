import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisContent } from "./AnalysisContent";
import { generatePDF } from "@/utils/pdfUtils";

interface AnalysisPanelProps {
  isLoading?: boolean;
  analysis?: string;
}

export function AnalysisPanel({ isLoading, analysis }: AnalysisPanelProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (analysis) {
      await navigator.clipboard.writeText(analysis);
      toast({
        title: "Copied!",
        description: "Analysis copied to clipboard",
      });
    }
  };

  const exportToPDF = async () => {
    if (!analysis) return;
    
    try {
      const element = document.getElementById('analysis-content');
      if (!element) {
        throw new Error('Content element not found');
      }

      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your document",
      });

      const publicUrl = await generatePDF(element, 'revenue-analysis');

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = 'revenue-analysis.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success!",
        description: "Your PDF has been downloaded",
      });
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!analysis && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white text-gray-700 p-4 sm:p-8">
        <p className="text-center text-base font-inter">
          Fill out the form to receive your personalized revenue opportunity analysis.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-white p-4 sm:p-8 border-border/50 h-full overflow-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
          </div>
          <p className="text-base text-muted-foreground animate-pulse font-inter">
            Analyzing your business opportunities...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={exportToPDF}
            >
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>
          <AnalysisContent content={analysis} />
        </div>
      )}
    </Card>
  );
}