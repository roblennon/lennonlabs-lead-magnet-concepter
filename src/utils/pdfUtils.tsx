import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";

// Configure PDF fonts and styling
const configurePDF = (pdf: jsPDF) => {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setLineHeightFactor(1.5);
};

const stripXMLTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, '').trim();
};

const processContent = (content: string): { type: 'heading' | 'paragraph' | 'list', text: string }[] => {
  // Split content by newlines and process each line
  return content.split('\n').map(line => {
    line = stripXMLTags(line.trim());
    if (!line) return null;

    // Detect content type based on markdown-like patterns
    if (line.startsWith('# ') || line.includes('Highest-Leverage') || line.includes('Key Benefits') || line.includes('Next Steps')) {
      return { type: 'heading', text: line.replace('# ', '') };
    } else if (line.startsWith('- ')) {
      return { type: 'list', text: line.substring(2) };
    } else {
      return { type: 'paragraph', text: line };
    }
  }).filter(Boolean);
};

const addTextWithWrapping = (
  pdf: jsPDF, 
  content: { type: 'heading' | 'paragraph' | 'list', text: string },
  x: number, 
  y: number, 
  maxWidth: number
): number => {
  // Configure styling based on content type
  switch (content.type) {
    case 'heading':
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      break;
    case 'list':
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      content.text = '• ' + content.text; // Add bullet point
      break;
    case 'paragraph':
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      break;
  }

  // Split text to fit width and add to PDF
  const lines = pdf.splitTextToSize(content.text, maxWidth);
  pdf.text(lines, x, y);

  // Calculate next Y position based on content type and number of lines
  const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
  const spacing = content.type === 'heading' ? 2 : 1;
  return y + (lines.length * lineHeight * spacing);
};

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    // Initialize PDF with A4 format
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    configurePDF(pdf);

    // Get page dimensions and set margins
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Get content and process it
    const rawContent = element.innerText || element.textContent;
    const processedContent = processContent(rawContent);

    let currentY = margin;

    // Add title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    currentY = addTextWithWrapping(
      pdf,
      { type: 'heading', text: "Your Fastest Paths to Revenue" },
      margin,
      currentY,
      maxWidth
    );
    currentY += 10; // Extra spacing after title

    // Process each content block
    for (const content of processedContent) {
      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      currentY = addTextWithWrapping(
        pdf,
        content,
        margin,
        currentY,
        maxWidth
      );

      // Add appropriate spacing after each content block
      currentY += content.type === 'heading' ? 8 : 4;
    }

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
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