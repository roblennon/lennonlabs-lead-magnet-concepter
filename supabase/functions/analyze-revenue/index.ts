import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FALLBACK_MODEL = "anthropic/claude-3.5-sonnet-20240620:beta";

async function callOpenRouter(prompt: string, model: string) {
  console.log('Calling OpenRouter with model:', model);
  console.log('Using prompt:', prompt);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'HTTP-Referer': 'https://lennonlabs.com',
      'X-Title': 'Revenue Opportunity Finder',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenRouter API error for model ${model}:`, {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log('OpenRouter raw response:', result);

  if (result.error) {
    console.error(`Error from OpenRouter for model ${model}:`, result.error);
    throw new Error(result.error.message || 'Unknown error from OpenRouter');
  }

  if (!result.choices?.[0]?.message?.content) {
    console.error(`Invalid OpenRouter response structure for model ${model}:`, result);
    throw new Error('No valid content in OpenRouter response');
  }

  console.log('Generated content:', result.choices[0].message.content);
  return result.choices[0].message.content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysisId, prompt, data } = await req.json();
    console.log('Raw request data:', { analysisId, prompt, data });

    // Format the prompt with the user's data
    const formattedPrompt = prompt
      .replace('{{offer}}', data.offer || '')
      .replace('{{revenueSource}}', data.revenueSource || '')
      .replace('{{helpRequests}}', data.helpRequests || '');

    console.log('Formatted prompt with variables replaced:', formattedPrompt);

    let analysisContent;
    try {
      analysisContent = await callOpenRouter(formattedPrompt, "google/gemini-2.0-flash-exp:free");
    } catch (primaryError) {
      console.log('Primary model failed, attempting fallback...', primaryError);
      try {
        analysisContent = await callOpenRouter(formattedPrompt, FALLBACK_MODEL);
      } catch (fallbackError) {
        console.error('Both primary and fallback models failed:', { primaryError, fallbackError });
        throw new Error('All available models failed to generate analysis');
      }
    }

    // Update the analysis in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Updating analysis in database with ID:', analysisId);
    const { error: updateError } = await supabase
      .from('revenue_analyses')
      .update({ analysis: analysisContent })
      .eq('id', analysisId);

    if (updateError) {
      console.error('Error updating analysis in database:', updateError);
      throw updateError;
    }

    console.log('Successfully completed analysis process');
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