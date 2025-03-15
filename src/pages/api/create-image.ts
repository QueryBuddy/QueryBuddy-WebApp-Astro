import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = response.data[0].url;

    return new Response(JSON.stringify({ url: imageUrl }), {
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