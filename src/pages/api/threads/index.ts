import type { APIRoute } from 'astro';
import { listThreads } from '../../../lib/threads/messages';

export const GET: APIRoute = async () => {
  try {
    const threads = listThreads();
    return new Response(JSON.stringify(threads), {
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