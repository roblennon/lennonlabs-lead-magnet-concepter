import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";

// Configure PDF fonts and styling
const configurePDF = (pdf: jsPDF) => {
  pdf.setFont("helvetica");
  pdf.setFontSize(11);
  pdf.setLineHeightFactor(1.5);
};

const addTextWithWrapping = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number): number => {
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

    // Get text content
    const content = element.innerText;
    
    // Split content into sections
    const sections = content.split('\n\n').filter(Boolean);

    let currentY = margin;
    let currentPage = 1;

    // Process each section
    sections.forEach((section: string) => {
      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentPage++;
        currentY = margin;
      }

      // Add section text with proper wrapping
      if (section.trim()) {
        currentY = addTextWithWrapping(pdf, section.trim(), margin, currentY, maxWidth);
        currentY += 5; // Add some spacing between sections
      }
    });

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