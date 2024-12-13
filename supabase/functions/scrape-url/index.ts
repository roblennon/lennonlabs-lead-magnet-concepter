import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';
import { Readability } from 'npm:@mozilla/readability';

interface RequestBody {
  url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    const { url } = await req.json() as RequestBody;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching URL:', url);

    // Fetch the webpage content
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML document');
    }

    // Extract the main content using Readability
    const reader = new Readability(doc);
    const article = reader.parse();
    
    if (!article) {
      return new Response(
        JSON.stringify({ error: 'Could not extract content from URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the content
    const cleanContent = article.textContent
      .replace(/\s+/g, ' ')
      .trim()
      .split(/[.!?]/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim() + '.')
      .join('\n\n');

    console.log('Successfully extracted content from URL');

    return new Response(
      JSON.stringify({ 
        content: cleanContent,
        title: article.title || '',
        excerpt: article.excerpt || ''
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    );
  } catch (error) {
    console.error('Error in scrape-url function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    );
  }
})