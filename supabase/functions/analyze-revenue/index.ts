import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const openrouterKey = Deno.env.get('OPENROUTER_API_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { analysisId, prompt, model, temperature, data } = await req.json();
    console.log('Analyzing revenue data:', { analysisId, model, temperature });

    // Format the prompt with the user's data
    const formattedPrompt = prompt
      .replace('{{offer}}', data.offer)
      .replace('{{revenue_source}}', data.revenueSource)
      .replace('{{help_requests}}', data.helpRequests);

    // Send request to OpenRouter
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'HTTP-Referer': 'https://lennonlabs.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: formattedPrompt }
        ],
        temperature: temperature,
      }),
    });

    const result = await openrouterResponse.json();
    const analysisContent = result.choices[0]?.message?.content || '';

    // Update the analysis in the database
    const { error: updateError } = await supabase
      .from('revenue_analyses')
      .update({ analysis: analysisContent })
      .eq('id', analysisId);

    if (updateError) throw updateError;

    // Return the analysis content
    return new Response(JSON.stringify({ content: analysisContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-revenue function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});