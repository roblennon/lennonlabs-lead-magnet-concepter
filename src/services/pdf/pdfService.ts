import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';
import { pdfStyles, getPdfOptions } from './pdfStyles';

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