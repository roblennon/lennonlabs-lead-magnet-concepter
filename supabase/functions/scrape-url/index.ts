import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';
import { extract } from 'https://deno.land/x/article_extractor@v1.0.0/mod.ts';

interface RequestBody {
  url: string;
}

serve(async (req) => {
  try {
    const { url } = await req.json() as RequestBody;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the webpage content
    const response = await fetch(url);
    const html = await response.text();

    // Extract the main content using article-extractor
    const article = await extract(url, html);
    
    if (!article || !article.content) {
      return new Response(
        JSON.stringify({ error: 'Could not extract content from URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the content and convert to markdown-like format
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, 'text/html');
    const textContent = doc?.textContent || '';
    
    // Basic cleanup
    const cleanContent = textContent
      .replace(/\s+/g, ' ')
      .trim()
      .split(/[.!?]/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim() + '.')
      .join('\n\n');

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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
})