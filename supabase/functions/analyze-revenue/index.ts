import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, offer, revenueSource, helpRequests } = await req.json()

    // Create Supabase client with service role key for admin access
    const supabaseAdmin = await fetch(`${SUPABASE_URL}/rest/v1/prompts?is_active=eq.true&order=created_at.desc&limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    
    const [activePrompt] = await supabaseAdmin.json();
    
    if (!activePrompt) {
      throw new Error('No active prompt template found');
    }

    // Replace variables in the prompt template
    const prompt = activePrompt.content
      .replace('{{offer}}', offer)
      .replace('{{revenue_source}}', revenueSource)
      .replace('{{help_requests}}', helpRequests);

    console.log('Using prompt:', prompt);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://lennonlabs.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-2',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    const analysis = data.choices[0].message.content

    // Store the analysis in the database
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/revenue_analyses`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        offer,
        revenue_source: revenueSource,
        help_requests: helpRequests,
        analysis,
        prompt_id: activePrompt.id,
      }),
    });

    if (!insertResponse.ok) {
      throw new Error('Failed to store analysis');
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in analyze-revenue function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})