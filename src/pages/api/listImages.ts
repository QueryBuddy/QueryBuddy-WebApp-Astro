import type { APIRoute } from 'astro';
import { readdir } from 'node:fs/promises';
import path from 'path';

export const GET: APIRoute = async () => {
    try {
        const tempDir = path.join(process.cwd(), 'temp');
        const files = await readdir(tempDir);
        
        return new Response(JSON.stringify(files), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error listing images:', error);
        return new Response(JSON.stringify({ error: 'Failed to list images' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 