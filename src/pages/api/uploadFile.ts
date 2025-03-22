import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import path from 'path';
import fs from 'fs';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.promises.mkdir(tempDir, { recursive: true });

        // Save file
        const filePath = path.join(tempDir, file.name);
        await writeFile(filePath, buffer);

        return new Response(JSON.stringify({ 
            success: true,
            filename: file.name,
            path: `/temp/${file.name}`
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ error: 'Upload failed' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 