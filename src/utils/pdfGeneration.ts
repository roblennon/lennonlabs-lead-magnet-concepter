import html2pdf from 'html2pdf.js';
import { supabase } from "@/integrations/supabase/client";

export const generateAndUploadPDF = async (element: HTMLElement, data: any) => {
  const timestamp = new Date().getTime();
  const filename = `lead-magnet-ideas-${timestamp}.pdf`;
  
  const pdf = await html2pdf().set({
    margin: 1,
    filename: 'lead-magnet-ideas.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 1.5,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true,
      precision: 3
    }
  }).from(element).output('blob');

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('analysis-pdfs')
    .upload(filename, pdf, {
      contentType: 'application/pdf',
      cacheControl: '15780000'
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('analysis-pdfs')
    .getPublicUrl(filename);

  return publicUrl;
};