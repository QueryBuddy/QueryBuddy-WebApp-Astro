import type { APIRoute } from 'astro';
import { readdir, unlink } from 'node:fs/promises';
import path from 'path';

export const GET: APIRoute = async () => {
    try {
        const tempDir = path.join(process.cwd(), 'temp');
        const files = await readdir(tempDir);
        
        await Promise.all(
            files.map(file => 
                unlink(path.join(tempDir, file))
            )
        );
        
        return new Response(JSON.stringify({ message: 'cleared!' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error clearing images:', error);
        return new Response(JSON.stringify({ error: 'Failed to clear images' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 