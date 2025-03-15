import type { APIRoute } from 'astro';
import { models } from '../../lib/models';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(models), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}; 