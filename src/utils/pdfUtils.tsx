import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    // Create a temporary container for styling
    const container = document.createElement('div');
    container.style.padding = '48px'; // Increased padding to ensure content stays within safe area
    container.style.maxWidth = '700px'; // Slightly reduced to account for margins
    container.style.margin = '0 auto';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12pt';
    container.style.lineHeight = '1.6';
    container.style.color = '#000';
    container.style.boxSizing = 'border-box'; // Ensure padding is included in width calculation

    // Get the content and apply styling
    const content = element.cloneNode(true) as HTMLElement;
    content.style.width = '100%'; // Ensure content respects container width
    content.style.overflow = 'visible'; // Allow content to flow naturally
    
    // Style headings
    content.querySelectorAll('h1').forEach(h1 => {
      h1.style.fontSize = '24pt';
      h1.style.fontWeight = 'bold';
      h1.style.marginBottom = '20px';
      h1.style.color = '#000';
      h1.style.wordWrap = 'break-word';
    });

    content.querySelectorAll('h2').forEach(h2 => {
      h2.style.fontSize = '18pt';
      h2.style.fontWeight = 'bold';
      h2.style.marginTop = '25px';
      h2.style.marginBottom = '15px';
      h2.style.color = '#000';
      h2.style.wordWrap = 'break-word';
    });

    content.querySelectorAll('h3').forEach(h3 => {
      h3.style.fontSize = '16pt';
      h3.style.fontWeight = 'bold';
      h3.style.marginTop = '20px';
      h3.style.marginBottom = '10px';
      h3.style.color = '#000';
      h3.style.wordWrap = 'break-word';
    });

    // Style paragraphs
    content.querySelectorAll('p').forEach(p => {
      p.style.marginBottom = '12px';
      p.style.fontSize = '12pt';
      p.style.color = '#000';
      p.style.wordWrap = 'break-word';
      p.style.whiteSpace = 'pre-wrap';
      p.style.width = '100%'; // Ensure paragraphs respect container width
    });

    // Style lists
    content.querySelectorAll('ul').forEach(ul => {
      ul.style.marginLeft = '20px';
      ul.style.marginBottom = '15px';
      ul.style.listStyleType = 'disc';
      ul.style.paddingRight = '20px';
      ul.style.width = 'calc(100% - 40px)'; // Account for left margin and right padding
    });

    content.querySelectorAll('li').forEach(li => {
      li.style.marginBottom = '8px';
      li.style.fontSize = '12pt';
      li.style.color = '#000';
      li.style.wordWrap = 'break-word';
    });

    // Add the styled content to the container
    container.appendChild(content);

    // Generate PDF with specific settings
    const pdfOptions = {
      margin: [25, 25, 25, 25], // Increased margins for safety
      filename: 'revenue-analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        windowWidth: 1200,
        scrollY: -window.scrollY,
        width: 800, // Fixed width for consistent rendering
        height: undefined, // Let height adjust automatically
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        hotfixes: ['px_scaling'],
      }
    };

    // Generate PDF blob
    const pdf = await html2pdf().set(pdfOptions).from(container).output('blob');
    
    // Generate unique filename
    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

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

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};