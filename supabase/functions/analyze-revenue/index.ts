import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, offer, revenue_source, help_requests, promptId } = await req.json();
    console.log('Received analysis request:', { email, revenue_source, promptId });

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, create a record in revenue_analyses
    const { data: analysisRecord, error: insertError } = await supabaseAdmin
      .from('revenue_analyses')
      .insert({
        email,
        offer,
        revenue_source,
        help_requests,
        prompt_id: promptId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting analysis record:', insertError);
      throw insertError;
    }

    // Get the prompt content if a promptId was provided
    let promptContent = '';
    if (promptId) {
      const { data: promptData, error: promptError } = await supabaseAdmin
        .from('prompts')
        .select('content')
        .eq('id', promptId)
        .single();

      if (promptError) {
        console.error('Error fetching prompt:', promptError);
        throw promptError;
      }

      promptContent = promptData.content;
    }

    // For now, return a simple analysis (you can enhance this later)
    const analysis = `Based on your input:

1. Business Offering: ${offer}
2. Revenue Source: ${revenue_source}
3. Areas Needing Help: ${help_requests}

Here's a preliminary analysis of your revenue opportunities...
[Analysis content will be expanded based on the actual implementation]`;

    // Update the analysis in the database
    const { error: updateError } = await supabaseAdmin
      .from('revenue_analyses')
      .update({ analysis })
      .eq('id', analysisRecord.id);

    if (updateError) {
      console.error('Error updating analysis:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in analyze-revenue function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
