import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Use a single model instead of fallbacks
const MODEL = "anthropic/claude-3.5-sonnet-20240620:beta";

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
      ],
      max_tokens: 4000, // Increased max tokens for longer responses
      temperature: 0.7 // Slightly reduced temperature for more focused responses
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Log the incoming request
    console.log('Received request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });

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

    let analysisContent = null;
    
    try {
      analysisContent = await callOpenRouter(formattedPrompt, MODEL);
      console.log('Successfully generated analysis content');
      console.log('Analysis content length:', analysisContent.length);
    } catch (error) {
      console.error(`Model ${MODEL} failed:`, error);
      throw error;
    }

    // Update the analysis in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Updating analysis in database with ID:', analysisId);
    const { error: updateError } = await supabase
      .from('revenue_analyses')
      .update({ 
        analysis: analysisContent,
        successful_model: MODEL
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('Error updating analysis in database:', updateError);
      throw updateError;
    }

    console.log('Successfully completed analysis process');
    return new Response(
      JSON.stringify({ content: analysisContent }), 
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