import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/components/RevenueForm";

export const subscribeToConvertKit = async (email: string, data: FormData, pdfUrl: string) => {
  console.log("Starting ConvertKit subscription process with:", { email, pdfUrl });
  
  try {
    const { data: response, error } = await supabase.functions.invoke('subscribe-convertkit', {
      body: { 
        email,
        fields: {
          offer_desc: data.offer,
          lead_magnet: "5-min rapid results lead magnet",
          lead_magnet_link: pdfUrl,
          pdfUrl: pdfUrl
        }
      }
    });

    if (error) {
      console.error('ConvertKit subscription error:', error);
      throw error;
    }
    
    console.log('Successfully called ConvertKit subscription endpoint:', response);
    return response;
  } catch (error) {
    console.error('Error in ConvertKit subscription:', error);
    throw error;
  }
};