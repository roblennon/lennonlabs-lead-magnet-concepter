import html2pdf from 'html2pdf.js';
import { supabase } from "@/integrations/supabase/client";

const PDF_FOOTER_HTML = `
<div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 1rem; display: flex; align-items: center; gap: 0.5rem; color: #71717a; font-family: Inter, sans-serif; font-size: 0.875rem;">
  <img src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" style="height: 20px; width: 20px;" />
  <span>Made with</span>
  <span style="color: #ef4444;">❤️</span>
  <span>by Rob Lennon |</span>
  <a href="https://lennonlabs.com" style="color: #eab308; text-decoration: none;">lennonlabs.com</a>
</div>
`;

export const processMarkdownForPDF = (markdown: string): string => {
  // Process the markdown to add page breaks before H2 headings
  const processedContent = markdown.replace(/^## /gm, '<div class="page-break"></div>\n## ');
  
  // Add extra spacing between H2 and H3
  return processedContent.replace(/^### /gm, '<div class="h3-spacing"></div>\n### ');
};

export const generatePDF = async (element: HTMLElement, filename: string) => {
  const timestamp = new Date().getTime();
  const storageFilename = `${filename}-${timestamp}.pdf`;
  
  // Add necessary styles for PDF generation
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .page-break { page-break-before: always; }
    .h3-spacing { margin-top: 1.5rem; }
    @page {
      margin: 1in;
      padding: 0;
      background: transparent;
    }
  `;
  element.appendChild(styleSheet);
  
  // Create optimized PDF
  const pdf = await html2pdf().set({
    margin: [0.75, 0.75, 1.25, 0.75], // top, right, bottom, left (in inches)
    filename: 'revenue-analysis.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: null // Make background transparent
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true,
      precision: 3
    },
    pagebreak: { 
      mode: ['css', 'legacy'],
      before: '.page-break'
    },
    footer: {
      height: '1.25in',
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

    // Clean up temporary styles
    element.removeChild(styleSheet);
    
    return publicUrl;
  } catch (error) {
    // Clean up temporary styles even if there's an error
    element.removeChild(styleSheet);
    console.error('Error saving PDF:', error);
    throw error;
  }
};