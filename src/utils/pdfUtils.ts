import html2pdf from 'html2pdf.js';
import { supabase } from "@/integrations/supabase/client";

const PDF_FOOTER_HTML = `
<div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 1rem; border-top: 1px solid #3e3a45; background-color: white; display: flex; align-items: center; gap: 0.5rem; color: #71717a; font-family: Inter, sans-serif; font-size: 0.875rem;">
  <img src="https://lennonlabs-revenue-finder.lovable.app/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" style="height: 20px; width: 20px;" />
  <span>Made with</span>
  <span style="color: #ef4444;">❤️</span>
  <span>by Rob Lennon |</span>
  <a href="https://lennonlabs.com" style="color: #eab308; text-decoration: none;">lennonlabs.com</a>
</div>
`;

export const processMarkdownForPDF = (markdown: string): string => {
  // Process the markdown content
  return markdown;
};

export const generatePDF = async (element: HTMLElement, filename: string) => {
  const timestamp = new Date().getTime();
  const storageFilename = `${filename}-${timestamp}.pdf`;
  
  // Create a temporary container with proper styling
  const container = document.createElement('div');
  container.className = 'pdf-container';
  
  // Copy the content from the original element
  container.innerHTML = element.innerHTML;
  
  // Add necessary styles for PDF generation
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    .pdf-container {
      font-family: 'Inter', sans-serif;
      color: #374151;
      line-height: 1.6;
      padding: 1in 1in 1.5in 1in;
    }
    
    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #111827;
    }
    
    h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #1f2937;
      page-break-before: always;
    }
    
    h2:first-of-type {
      page-break-before: avoid;
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      color: #374151;
    }
    
    p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    ul, ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    strong {
      font-weight: 600;
      color: #111827;
    }
    
    @page {
      margin: 0;
      padding: 0;
    }
  `;
  
  container.appendChild(styleSheet);
  document.body.appendChild(container);
  
  try {
    // Generate PDF with optimized settings
    const pdf = await html2pdf().set({
      margin: 0,
      filename: 'revenue-analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: null,
        logging: true,
        removeContainer: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true,
        precision: 3
      },
      pagebreak: { mode: 'css' },
      footer: {
        height: '1.5in',
        contents: {
          default: PDF_FOOTER_HTML
        }
      }
    }).from(container).output('blob');

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdf, {
        contentType: 'application/pdf',
        cacheControl: '15780000'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('analysis-pdfs')
      .getPublicUrl(storageFilename);

    // Clean up
    document.body.removeChild(container);
    
    return publicUrl;
  } catch (error) {
    // Clean up on error
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    console.error('Error saving PDF:', error);
    throw error;
  }
};