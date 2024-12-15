import { supabase } from "@/integrations/supabase/client";
import markdownpdf from 'markdown-pdf';
import { promisify } from 'util';

const markdownToPdfAsync = promisify(markdownpdf);

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
  // Clean up any existing page break markers
  return markdown.trim();
};

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    // Get the markdown content from the element
    const markdownContent = element.textContent || '';
    
    // Create a temporary file with the markdown content
    const pdfBuffer = await markdownToPdfAsync(markdownContent, {
      cssPath: null, // Disable default styling
      remarkable: {
        breaks: true,
        html: true,
      },
      cssString: PDF_STYLES,
    });

    // Generate unique filename
    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdfBuffer, {
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