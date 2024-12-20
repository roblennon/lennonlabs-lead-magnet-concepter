import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';
import { pdfStyles, getPdfOptions } from './pdfStyles';

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
    const styledElement = applyPdfStyles(element);
    const pdfOptions = getPdfOptions(filename);
    const pdf = await html2pdf().set(pdfOptions).from(styledElement).output('blob');

    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

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

    const { data: { publicUrl } } = supabase.storage
      .from('analysis-pdfs')
      .getPublicUrl(storageFilename);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};