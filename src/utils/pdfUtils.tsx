import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";

// Configure PDF fonts and styling
const configurePDF = (pdf: jsPDF) => {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setLineHeightFactor(1.5);
};

const addTextWithWrapping = (
  pdf: jsPDF, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number,
  options: { fontSize?: number; isBold?: boolean } = {}
): number => {
  if (options.fontSize) {
    pdf.setFontSize(options.fontSize);
  }
  if (options.isBold) {
    pdf.setFont("helvetica", "bold");
  } else {
    pdf.setFont("helvetica", "normal");
  }

  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return y + (lines.length * pdf.getLineHeight());
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

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Get content and split into sections
    const content = element.innerHTML;
    const sections = content.split(/<\/?p>/).filter(Boolean)
      .map(section => section.trim())
      .filter(section => section.length > 0);

    let currentY = margin;

    // Add title
    currentY = addTextWithWrapping(
      pdf,
      "Your Fastest Paths to Revenue",
      margin,
      currentY,
      maxWidth,
      { fontSize: 16, isBold: true }
    );
    currentY += 10; // Extra spacing after title

    // Process each section
    for (let section of sections) {
      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      // Check if section is a heading (contains "Highest-Leverage" or similar key phrases)
      const isHeading = section.includes("Highest-Leverage") || 
                       section.includes("Here are your") ||
                       section.includes("Key Benefits") ||
                       section.includes("Next Steps");

      if (isHeading) {
        currentY += 5; // Extra space before headings
        currentY = addTextWithWrapping(
          pdf,
          section,
          margin,
          currentY,
          maxWidth,
          { fontSize: 13, isBold: true }
        );
        currentY += 5; // Extra space after headings
      } else {
        // Regular paragraph
        currentY = addTextWithWrapping(
          pdf,
          section,
          margin,
          currentY,
          maxWidth
        );
        currentY += 5; // Standard paragraph spacing
      }
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