import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';

const PDF_STYLES = `
body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #374151;
  max-width: 65ch;
  padding: 2rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

h2 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: #1F2937;
  page-break-before: always;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: #374151;
}

p {
  margin-bottom: 1.25rem;
}

ul, ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

strong {
  font-weight: 600;
  color: #111827;
}
`;

export const processMarkdownForPDF = (markdown: string): string => {
  // Convert markdown to HTML using ReactMarkdown
  const htmlContent = renderToString(
    <ReactMarkdown>{markdown}</ReactMarkdown>
  );

  // Wrap the HTML content with proper styling
  return `
    <html>
      <head>
        <style>${PDF_STYLES}</style>
      </head>
      <body>
        <div class="prose prose-slate max-w-none font-inter">
          ${htmlContent}
        </div>
      </body>
    </html>
  `;
};

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1200,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    const pdfBlob = pdf.output('blob');

    // Generate unique filename
    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdfBlob, {
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
    console.error('Error generating PDF:', error);
    throw error;
  }
};