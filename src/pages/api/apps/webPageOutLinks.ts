import type { APIRoute } from 'astro';
import { JSDOM } from 'jsdom';

export const GET: APIRoute = async ({ url }) => {
  const pageUrl = url.searchParams.get('url');

  if (!pageUrl) {
    return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const body = await response.text();
    
    const dom = new JSDOM(body);
    const links = dom.window.document.querySelectorAll('a');
    const outLinks = Array.from(links)
      .map(link => link.href)
      .filter(href => href);

    return new Response(JSON.stringify({ links: outLinks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 