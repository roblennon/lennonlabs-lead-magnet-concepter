import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')

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

    const prompt = `As a revenue optimization expert, analyze this business:

Offer/Website: ${offer}
Current Revenue Source: ${revenueSource}
Common Help Requests: ${helpRequests}

Provide a detailed analysis in markdown format that includes:
1. Quick Revenue Wins (immediate opportunities)
2. Growth Strategy (medium-term opportunities)
3. Scale Plan (long-term vision)
4. Action Steps (prioritized next steps)

Format the response in clean markdown with proper headings and bullet points.`

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

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})