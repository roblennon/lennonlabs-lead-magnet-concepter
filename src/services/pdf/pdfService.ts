import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';
import { pdfStyles } from './pdfStyles';

const applyPdfStyles = (content: HTMLElement) => {
  const container = document.createElement('div');
  Object.assign(container.style, pdfStyles.container);
  
  const styledContent = content.cloneNode(true) as HTMLElement;
  styledContent.className = pdfStyles.content.prose;
  
  container.appendChild(styledContent);
  return container;
};

export const generateAndUploadPDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    console.log("Starting PDF generation process...");
    const styledElement = applyPdfStyles(element);
    
    console.log("Generating PDF blob...");
    const pdfOptions = {
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
    };

    const pdf = await html2pdf().set(pdfOptions).from(styledElement).output('blob');
    console.log("PDF blob generated successfully");

    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

    console.log("Uploading PDF to Supabase storage...");
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

    console.log("PDF uploaded successfully, getting public URL...");
    const { data: { publicUrl } } = supabase.storage
      .from('analysis-pdfs')
      .getPublicUrl(storageFilename);

    console.log("PDF process completed successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in PDF generation process:', error);
    throw error;
  }
};