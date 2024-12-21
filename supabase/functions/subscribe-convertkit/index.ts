import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CONVERTKIT_API_KEY = Deno.env.get("CONVERTKIT_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log("Edge function booted", { time: new Date().toISOString() });

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting ConvertKit subscription process");
    
    const { email, fields } = await req.json();
    console.log("Email:", email);
    console.log("Raw fields:", fields);

    // Get form ID from the request or use default
    const FORM_ID = "7469655";
    console.log("Sending to ConvertKit form ID:", FORM_ID);

    // Process the fields before sending
    const processedFields = { ...fields };
    if (processedFields.lead_magnet_link === "{{deliverable_link}}" && fields.pdfUrl) {
      processedFields.lead_magnet_link = fields.pdfUrl;
      console.log("Replaced deliverable_link placeholder with:", fields.pdfUrl);
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
    console.log("ConvertKit API response:", data);

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