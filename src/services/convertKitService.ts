import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/hooks/useRevenueForm";

export const subscribeToConvertKit = async (email: string, data: FormData, pdfUrl: string) => {
  console.log("Subscribing to ConvertKit with:", { email, data, pdfUrl });
  
  const { error } = await supabase.functions.invoke('subscribe-convertkit', {
    body: { 
      email,
      fields: {
        offer_desc: data.offer,
        lead_magnet: "5-min rapid results lead magnet",
        lead_magnet_link: pdfUrl,
        email: email  // Adding email to fields as well for potential use in ConvertKit automations
      }
    }
  });

  if (error) {
    console.error('ConvertKit subscription error:', error);
    throw error;
  }
  
  console.log('Successfully called ConvertKit subscription endpoint');
};