import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

const PDF_STYLES = `
body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #374151;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 2rem;
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
  page-break-inside: avoid;
}

ul, ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
  page-break-inside: avoid;
}

li {
  margin-bottom: 0.5rem;
}

strong {
  font-weight: 600;
  color: #111827;
}

@page {
  margin: 1cm;
  size: A4;
}

@media print {
  body {
    width: 21cm;
    height: 29.7cm;
    margin: 0;
    padding: 1.5cm;
  }
}
`;

export const processMarkdownForPDF = (markdown: string): string => {
  const htmlContent = renderToStaticMarkup(
    React.createElement(ReactMarkdown, null, markdown)
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
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
    // Create a hidden container for PDF generation
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.innerHTML = processMarkdownForPDF(element.innerText);
    document.body.appendChild(container);

    const pdf = new jsPDF({
      format: 'a4',
      unit: 'pt',
      orientation: 'portrait'
    });

    // Calculate page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;

    // Generate PDF with multiple pages
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: pageWidth - (margin * 2),
      height: container.scrollHeight,
      backgroundColor: '#ffffff'
    });

    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    const pageContentHeight = pageHeight - (margin * 2);
    const totalPages = Math.ceil(contentHeight / pageContentHeight);

    // Add content page by page
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const srcY = i * pageContentHeight;
      const sliceHeight = Math.min(pageContentHeight, contentHeight - srcY);

      pdf.addImage(
        canvas,
        'JPEG',
        margin,
        margin + (i === 0 ? 0 : -srcY),
        contentWidth,
        contentHeight
      );
    }

    // Clean up the temporary container
    document.body.removeChild(container);

    const pdfBlob = pdf.output('blob');
    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

    const { data, error } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '15780000'
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('analysis-pdfs')
      .getPublicUrl(storageFilename);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};