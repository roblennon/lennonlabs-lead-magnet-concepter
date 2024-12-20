import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';

// PDF styling configuration
const pdfStyles = {
  container: {
    padding: '15mm',
    maxWidth: '180mm',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12pt',
    lineHeight: '1.6',
    color: '#000',
  },
  headings: {
    h1: {
      fontSize: '24pt',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#000',
      pageBreakAfter: 'avoid',
    },
    h2: {
      fontSize: '18pt',
      fontWeight: 'bold',
      marginTop: '25px',
      marginBottom: '15px',
      color: '#000',
      pageBreakAfter: 'avoid',
    },
    h3: {
      fontSize: '16pt',
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '10px',
      color: '#000',
      pageBreakAfter: 'avoid',
    },
  },
  text: {
    paragraph: {
      marginBottom: '12px',
      fontSize: '12pt',
      color: '#000',
      pageBreakInside: 'avoid',
    },
    list: {
      marginLeft: '20px',
      marginBottom: '15px',
      listStyleType: 'disc',
      pageBreakInside: 'avoid',
    },
    listItem: {
      marginBottom: '8px',
      fontSize: '12pt',
      color: '#000',
    },
  },
};

// Apply styles to the content element
const applyPdfStyles = (content: HTMLElement) => {
  content.style.width = '100%';
  content.style.pageBreakInside = 'auto';

  content.querySelectorAll('h1').forEach(h1 => {
    Object.assign(h1.style, pdfStyles.headings.h1);
  });

  content.querySelectorAll('h2').forEach(h2 => {
    Object.assign(h2.style, pdfStyles.headings.h2);
  });

  content.querySelectorAll('h3').forEach(h3 => {
    Object.assign(h3.style, pdfStyles.headings.h3);
  });

  content.querySelectorAll('p').forEach(p => {
    Object.assign(p.style, pdfStyles.text.paragraph);
  });

  content.querySelectorAll('ul').forEach(ul => {
    Object.assign(ul.style, pdfStyles.text.list);
  });

  content.querySelectorAll('li').forEach(li => {
    Object.assign(li.style, pdfStyles.text.listItem);
  });

  return content;
};

// PDF generation options
const getPdfOptions = (filename: string) => ({
  margin: [15, 15, 15, 15],
  filename: `${filename}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    logging: false,
    windowWidth: undefined,
    scrollY: -window.scrollY,
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
    hotfixes: ['px_scaling'],
    putTotalPages: true,
  },
});

// Generate and upload PDF
export const generateAndUploadPDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    // Create container with styles
    const container = document.createElement('div');
    Object.assign(container.style, pdfStyles.container);

    // Clone and style content
    const content = element.cloneNode(true) as HTMLElement;
    const styledContent = applyPdfStyles(content);
    container.appendChild(styledContent);

    // Generate PDF blob
    const pdfOptions = getPdfOptions(filename);
    const pdf = await html2pdf().set(pdfOptions).from(container).output('blob');

    // Generate unique filename for storage
    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdf, {
        contentType: 'application/pdf',
        cacheControl: '15780000',
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      throw uploadError;
    }

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