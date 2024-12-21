import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CONVERTKIT_API_KEY = Deno.env.get("CONVERTKIT_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscribeRequest {
  email: string;
  fields: {
    offer_desc?: string;
    lead_magnet?: string;
    lead_magnet_link?: string;
    [key: string]: string | undefined;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fields } = await req.json() as SubscribeRequest;
    
    console.log("Subscribing email to ConvertKit:", email);
    console.log("Custom fields before processing:", fields);

    // Replace the placeholder with the actual PDF link if it exists
    const processedFields = { ...fields };
    if (processedFields.lead_magnet_link === "{{deliverable_link}}" && fields.pdfUrl) {
      processedFields.lead_magnet_link = fields.pdfUrl;
    }

    console.log("Processed fields:", processedFields);

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email,
          fields: processedFields,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("ConvertKit API error:", data);
      throw new Error(data.message || "Failed to subscribe to ConvertKit");
    }

    console.log("Successfully subscribed to ConvertKit:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in subscribe-convertkit function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});