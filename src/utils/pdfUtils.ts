import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from "@/integrations/supabase/client";

const PDF_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  .pdf-container {
    font-family: 'Inter', sans-serif;
    color: #374151;
    line-height: 1.6;
    padding: 40px 40px 60px 40px;
    background: transparent;
  }
  
  .pdf-container h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #111827;
  }
  
  .pdf-container h2 {
    font-size: 20px;
    font-weight: 600;
    margin-top: 32px;
    margin-bottom: 20px;
    color: #1f2937;
    page-break-before: always;
  }
  
  .pdf-container h2:first-of-type {
    page-break-before: avoid;
  }
  
  .pdf-container h3 {
    font-size: 18px;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 16px;
    color: #374151;
  }
  
  .pdf-container p {
    margin-bottom: 16px;
    font-size: 16px;
  }
  
  .pdf-container ul, .pdf-container ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }
  
  .pdf-container li {
    margin-bottom: 8px;
  }
  
  .pdf-container strong {
    font-weight: 600;
    color: #111827;
  }

  .pdf-footer {
    position: fixed;
    bottom: 20px;
    left: 40px;
    right: 40px;
    padding-top: 12px;
    border-top: 1px solid #3e3a45;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #71717a;
    font-size: 14px;
    background: transparent;
  }
`;

export const processMarkdownForPDF = (markdown: string): string => {
  return markdown;
};

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  const timestamp = new Date().getTime();
  const storageFilename = `${filename}-${timestamp}.pdf`;
  
  // Create a temporary container with proper styling
  const container = document.createElement('div');
  container.className = 'pdf-container';
  
  // Copy the content
  container.innerHTML = element.innerHTML;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = PDF_STYLES;
  container.appendChild(style);
  
  // Add footer template
  const footer = document.createElement('div');
  footer.className = 'pdf-footer';
  footer.innerHTML = `
    <img src="https://lennonlabs-revenue-finder.lovable.app/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" style="height: 20px; width: 20px;" />
    <span>Made with</span>
    <span style="color: #ef4444;">❤️</span>
    <span>by Rob Lennon |</span>
    <a href="https://lennonlabs.com" style="color: #eab308; text-decoration: none;">lennonlabs.com</a>
  `;
  container.appendChild(footer);
  
  // Add container to document temporarily
  document.body.appendChild(container);
  
  try {
    // Create PDF with jsPDF
    const pdf = new jsPDF({
      format: 'letter',
      unit: 'px',
      hotfixes: ['px_scaling']
    });
    
    // Convert the container to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      windowWidth: 816, // Letter width in pixels at 96 DPI
      windowHeight: 1056 // Letter height in pixels at 96 DPI
    });
    
    // Add the canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 816, 1056);
    
    // Convert to blob
    const pdfBlob = pdf.output('blob');
    
    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdfBlob, {
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
    console.error('Error generating PDF:', error);
    throw error;
  }
};