import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Download, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

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

  const exportToPDF = () => {
    if (analysis) {
      const element = document.getElementById('analysis-content');
      html2pdf()
        .set({
          margin: 1,
          filename: 'revenue-analysis.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .from(element)
        .save()
        .then(() => {
          toast({
            title: "Downloaded!",
            description: "Analysis saved as PDF",
          });
        });
    }
  };

  if (!analysis && !isLoading) {
    return (
      <div className="flex items-center justify-center text-muted-foreground p-8">
        <p className="text-center text-sm">
          Fill out the form on the left to receive your personalized revenue opportunity analysis.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-secondary/50 p-8 border-border/50">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Analyzing your business opportunities...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={copyToClipboard}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={exportToPDF}
            >
              <Download className="h-3 w-3 mr-1" />
              Export PDF
            </Button>
          </div>
          <div id="analysis-content" className="prose prose-invert max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </Card>
  );
}