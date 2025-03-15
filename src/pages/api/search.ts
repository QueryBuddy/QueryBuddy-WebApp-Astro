import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing search query' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
    const GOOGLE_CSE_ID = import.meta.env.GOOGLE_CSE_ID;

    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
      throw new Error('Google API credentials not configured');
    }

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    })) || [];

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 