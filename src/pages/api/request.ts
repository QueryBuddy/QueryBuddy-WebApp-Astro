import type { APIRoute } from 'astro';
import { newRequest } from '../../lib/request';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { model, threadId, prompt, type, urls, voice, startingMessage } = data;

    await newRequest({
      res: new Response(),
      model,
      threadId,
      prompt,
      type,
      urls,
      voice,
      startingMessage
    });

    return new Response(JSON.stringify({ status: 'OK' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in request:', error);
    return new Response(
      JSON.stringify({ 
        status: 'Error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}; 