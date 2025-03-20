import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
    const title = url.searchParams.get('title');

    if (!title) {
        return new Response(JSON.stringify({ error: 'Missing article title' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&titles=${encodeURIComponent(title)}&origin=*`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Wikipedia article');
        }

        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const content = pages[pageId].extract;

        if (!content) {
            throw new Error('Article not found');
        }

        return new Response(JSON.stringify({ content }), {
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