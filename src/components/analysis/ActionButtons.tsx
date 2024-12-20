import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAndUploadPDF } from "@/services/pdf/pdfService";

interface ActionButtonsProps {
  analysis: string;
}

export function ActionButtons({ analysis }: ActionButtonsProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(analysis);
    toast({
      title: "Copied!",
      description: "Analysis copied to clipboard",
    });
  };

  const exportToPDF = async () => {
    try {
      const element = document.getElementById('analysis-content');
      if (!element) {
        throw new Error('Content element not found');
      }

      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your document",
      });

      const publicUrl = await generateAndUploadPDF(element, 'revenue-analysis');

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

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-sm text-[#8E9196] hover:text-[#6E7075]"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4 mr-1" />
        Copy
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-sm text-[#8E9196] hover:text-[#6E7075]"
        onClick={exportToPDF}
      >
        <Download className="h-4 w-4 mr-1" />
        Export PDF
      </Button>
    </div>
  );
}