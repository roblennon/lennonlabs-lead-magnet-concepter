import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

export async function generateAndUploadPDF(element: HTMLElement, data: { email: string }) {
  try {
    // Generate canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Convert PDF to Blob
    const pdfBlob = pdf.output('blob');

    // Generate unique filename
    const timestamp = new Date().getTime();
    const filename = `lead-magnet-ideas-${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('analysis-pdfs')
      .upload(filename, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = await supabase
      .storage
      .from('analysis-pdfs')
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error generating/uploading PDF:', error);
    throw error;
  }
}