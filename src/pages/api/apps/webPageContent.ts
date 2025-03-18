import type { APIRoute } from 'astro';
import { JSDOM } from 'jsdom';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { links } = await request.json();

    if (!links || !Array.isArray(links)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid links array' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const results = await Promise.all(links.map(async (url: string) => {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        const text = await response.text();
        return text;
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return `Error fetching ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }));

    return new Response(JSON.stringify({ content: results.join('\n\n') }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
