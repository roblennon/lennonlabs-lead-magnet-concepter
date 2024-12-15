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
          jsPDF: { 
            unit: 'in', 
            format: 'letter', 
            orientation: 'portrait'
          },
          pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.section-break'
          }
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
      <div className="flex items-center justify-center h-full bg-white text-gray-700 p-8">
        <p className="text-center text-base font-inter">
          Fill out the form to receive your personalized revenue opportunity analysis.
        </p>
      </div>
    );
  }

  // Process the markdown to add section breaks before each heading
  const processedAnalysis = analysis?.replace(/^(#+ )/gm, (match) => {
    return `\n::: section-break\n${match}`;
  });

  return (
    <Card className="bg-white p-8 border-border/50 h-full">
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
          <div id="analysis-content" className="prose max-w-none font-inter text-gray-700 [&_.section-break]:break-before-page">
            <ReactMarkdown>{processedAnalysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </Card>
  );
}