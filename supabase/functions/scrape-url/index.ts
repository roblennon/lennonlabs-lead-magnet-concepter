import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';
import { Readability } from 'npm:@mozilla/readability';

interface RequestBody {
  url: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function normalizeUrl(url: string): string {
  // Remove any whitespace
  url = url.trim();
  
  // Check if it starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Add https:// by default
    url = 'https://' + url;
  }
  
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  
  return url;
}

function isValidUrl(url: string): boolean {
  try {
    // First normalize the URL
    const normalizedUrl = normalizeUrl(url);
    
    // Try to construct a URL object - this will validate the URL format
    new URL(normalizedUrl);
    
    // Additional validation if needed
    const hostname = new URL(normalizedUrl).hostname;
    // Ensure the hostname has at least one dot and a valid TLD
    return hostname.includes('.') && /^[a-zA-Z0-9-_.]+$/.test(hostname);
  } catch {
    console.error('Invalid URL format:', url);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json() as RequestBody;

    if (!url) {
      console.error('No URL provided');
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received URL:', url);

    // Check if the input looks like a URL
    if (!isValidUrl(url)) {
      console.error('Invalid URL format:', url);
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedUrl = normalizeUrl(url);
    console.log('Normalized URL:', normalizedUrl);

    // Fetch the webpage content
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

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
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the content
    const cleanContent = article.textContent
      .replace(/\s+/g, ' ')
      .trim()
      .split(/[.!?]/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim() + '.')
      .join('\n\n')
      .substring(0, 20000); // Limit to 20,000 characters

    console.log('Successfully extracted content from URL');

    return new Response(
      JSON.stringify({ 
        content: cleanContent,
        title: article.title || '',
        excerpt: article.excerpt || ''
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-url function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})