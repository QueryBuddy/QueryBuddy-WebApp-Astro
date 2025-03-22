import type { APIRoute } from 'astro';
import { getThreadMessages, deleteThread } from '../../../lib/threads/messages';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { threadId } = params;
        if (!threadId) {
            return new Response(JSON.stringify({ error: 'Thread ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const messages = getThreadMessages(threadId);
        return new Response(JSON.stringify(messages), {
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

export const DELETE: APIRoute = async ({ params }) => {
    try {
        const { threadId } = params;
        if (!threadId) {
            return new Response(JSON.stringify({ error: 'Thread ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        deleteThread(threadId);
        return new Response(JSON.stringify({ status: 'OK' }), {
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