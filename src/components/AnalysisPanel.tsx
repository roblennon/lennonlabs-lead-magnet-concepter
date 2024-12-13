import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Download, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import { useEffect, useState } from "react";

interface AnalysisPanelProps {
  isLoading?: boolean;
  analysis?: string;
  stream?: ReadableStream;
}

export function AnalysisPanel({ isLoading, analysis, stream }: AnalysisPanelProps) {
  const { toast } = useToast();
  const [streamedContent, setStreamedContent] = useState("");

  useEffect(() => {
    if (stream) {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = (buffer + chunk).split('\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  setStreamedContent(prev => prev + content);
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error reading stream:', error);
        }
      };

      processStream();
      return () => {
        reader.cancel();
      };
    }
  }, [stream]);

  const displayContent = streamedContent || analysis;

  const copyToClipboard = async () => {
    if (displayContent) {
      await navigator.clipboard.writeText(displayContent);
      toast({
        title: "Copied!",
        description: "Analysis copied to clipboard",
      });
    }
  };

  const exportToPDF = () => {
    if (displayContent) {
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

  if (!displayContent && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-foreground p-8">
        <p className="text-center text-base">
          Fill out the form to receive your personalized revenue opportunity analysis.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-white p-8 border-border/50">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
          </div>
          <p className="text-base text-gray-600 animate-pulse">
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
          <div id="analysis-content" className="prose prose-gray max-w-none">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </Card>
  );
}