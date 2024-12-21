import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CONVERTKIT_API_KEY = Deno.env.get("CONVERTKIT_API_KEY");
const FORM_ID = Deno.env.get("CONVERTKIT_FORM_ID") || "7469655"; // Using env var if available, fallback to default

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
    email?: string;
    [key: string]: string | undefined;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fields } = await req.json() as SubscribeRequest;
    
    console.log("ConvertKit Subscription Details:");
    console.log("Form ID:", FORM_ID);
    console.log("Subscriber Email:", email);
    console.log("Fields being sent:", fields);

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
          fields: {
            ...fields,
            lead_magnet_link: fields.lead_magnet_link || "{{deliverable_link}}",
            subscriber_email: email // Adding subscriber email as a field for reference
          }
        }),
      }
    );

    const data = await response.json();
    console.log("ConvertKit API Response:", data);

    if (!response.ok) {
      console.error("ConvertKit API error:", data);
      throw new Error(data.message || "Failed to subscribe to ConvertKit");
    }

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