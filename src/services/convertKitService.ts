import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/components/RevenueForm";

export const subscribeToConvertKit = async (email: string, data: FormData, pdfUrl: string) => {
  const { error } = await supabase.functions.invoke('subscribe-convertkit', {
    body: { 
      email,
      fields: {
        offer_desc: data.offer,
        lead_magnet: "Lead Magnet Generator",
        lead_magnet_link: pdfUrl
      }
    }
  });

  if (error) throw error;
  console.log('Successfully subscribed to ConvertKit');
};