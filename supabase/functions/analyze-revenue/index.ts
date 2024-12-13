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

    // Create streaming response to OpenRouter
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
        stream: true,
        temperature: temperature,
      }),
    });

    // Create a TransformStream to process the response chunks
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        controller.enqueue(text);

        // Try to parse the content from the chunk
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              
              // Update the analysis in the database with the new content
              if (content) {
                const { error } = await supabase
                  .from('revenue_analyses')
                  .update({ analysis: content })
                  .eq('id', analysisId);

                if (error) {
                  console.error('Error updating analysis:', error);
                }
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      },
    });

    // Pipe the response through our transform stream
    const responseStream = openrouterResponse.body!
      .pipeThrough(transformStream);

    return new Response(responseStream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error) {
    console.error('Error in analyze-revenue function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});