import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Define models in order of preference
const MODELS = [
  "anthropic/claude-3.5-sonnet-20240620:beta",
  "google/gemini-2.0-flash-exp:free",
  "x-ai/grok-2-1212",
  "meta-llama/llama-3.3-70b-instruct"
];

async function callOpenRouter(prompt: string, model: string) {
  console.log('Attempting to call OpenRouter with model:', model);
  
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
      ],
      max_tokens: 4000,
      temperature: 0.7
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

  return result.choices[0].message.content;
}

async function tryModelsSequentially(prompt: string): Promise<{ content: string, model: string }> {
  let lastError = null;
  
  for (const model of MODELS) {
    try {
      console.log(`Attempting to use model: ${model}`);
      const content = await callOpenRouter(prompt, model);
      console.log(`Successfully generated content using ${model}`);
      return { content, model };
    } catch (error) {
      console.error(`Failed to use model ${model}:`, error);
      lastError = error;
      continue; // Try next model
    }
  }
  
  // If we get here, all models failed
  throw new Error(`All models failed. Last error: ${lastError?.message}`);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { analysisId, prompt, data } = await req.json();
    console.log('Raw request data:', { analysisId, prompt, data });

    if (!analysisId || !prompt || !data) {
      throw new Error('Missing required fields');
    }

    const formattedPrompt = prompt
      .replace('{{offer}}', data.offer || '')
      .replace('{{revenueSource}}', data.revenueSource || '')
      .replace('{{helpRequests}}', data.helpRequests || '');

    console.log('Formatted prompt with variables replaced:', formattedPrompt);

    // Try models sequentially until one succeeds
    const { content: analysisContent, model: successfulModel } = await tryModelsSequentially(formattedPrompt);
    
    // Update the analysis in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Updating analysis in database with ID:', analysisId);
    const { error: updateError } = await supabase
      .from('revenue_analyses')
      .update({ 
        analysis: analysisContent,
        successful_model: successfulModel
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('Error updating analysis in database:', updateError);
      throw updateError;
    }

    console.log('Successfully completed analysis process');
    return new Response(
      JSON.stringify({ 
        content: analysisContent,
        model: successfulModel
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-revenue function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});