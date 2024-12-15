import html2pdf from 'html2pdf.js';
import { supabase } from "@/integrations/supabase/client";

const PDF_FOOTER_HTML = `
<div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 1rem; border-top: 1px solid #3e3a45; display: flex; align-items: center; gap: 0.5rem; color: #71717a; font-family: Inter, sans-serif; font-size: 0.875rem;">
  <img src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" style="height: 20px; width: 20px;" />
  <span>Made with</span>
  <span style="color: #ef4444;">❤️</span>
  <span>by Rob Lennon |</span>
  <a href="https://lennonlabs.com" style="color: #eab308; text-decoration: none;">lennonlabs.com</a>
</div>
`;

export const processMarkdownForPDF = (markdown: string): string => {
  // Only add page breaks before H2 headings (##)
  return markdown.replace(/^## /gm, '\n<div class="html2pdf__page-break"></div>\n## ');
};

export const generatePDF = async (element: HTMLElement, filename: string) => {
  const timestamp = new Date().getTime();
  const storageFilename = `${filename}-${timestamp}.pdf`;
  
  // Create optimized PDF
  const pdf = await html2pdf().set({
    margin: [1, 1, 2, 1], // top, right, bottom, left (in inches)
    filename: 'revenue-analysis.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 1.5,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true,
      precision: 3
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    footer: {
      height: '2in',
      contents: {
        default: PDF_FOOTER_HTML
      }
    }
  }).from(element).output('blob');

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdf, {
        contentType: 'application/pdf',
        cacheControl: '15780000'
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('analysis-pdfs')
      .getPublicUrl(storageFilename);

    return publicUrl;
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};