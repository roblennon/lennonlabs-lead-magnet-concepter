import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";

// Configure PDF fonts and styling
const configurePDF = (pdf: jsPDF) => {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setLineHeightFactor(1.5);
};

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    // Initialize PDF
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

    // Get raw text content
    const rawContent = element.innerText || element.textContent;
    if (!rawContent) throw new Error('No content found to generate PDF');

    let currentY = margin;

    // Add title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    const title = "Your Fastest Paths to Revenue";
    const titleLines = pdf.splitTextToSize(title, maxWidth);
    pdf.text(titleLines, margin, currentY);
    currentY += (titleLines.length * 10) + 10;

    // Process content line by line
    const lines = rawContent.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      // Skip the title since we already added it
      if (line.trim() === title) continue;

      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      // Style based on content type
      if (line.includes('Highest-Leverage') || line.includes('Key Benefits') || line.includes('Next Steps') || line.includes('Implementation Guide') || line.includes('Getting It Done')) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        const headingLines = pdf.splitTextToSize(line, maxWidth);
        pdf.text(headingLines, margin, currentY);
        currentY += (headingLines.length * 8) + 8;
      } else if (line.startsWith('-') || line.startsWith('•')) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        const listLines = pdf.splitTextToSize(line, maxWidth);
        pdf.text(listLines, margin + 5, currentY); // Indent list items
        currentY += (listLines.length * 6) + 2;
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        const textLines = pdf.splitTextToSize(line, maxWidth);
        pdf.text(textLines, margin, currentY);
        currentY += (textLines.length * 6) + 4;
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