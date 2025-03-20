import type { APIRoute } from 'astro';

interface VideoItem {
    title: string;
    description: string;
    thumbnail: string;
    videoId: string;
}

export const GET: APIRoute = async ({ url }) => {
    const channelId = url.searchParams.get('channelId');

    if (!channelId) {
        return new Response(JSON.stringify({ error: 'Missing channel ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const apiKey = import.meta.env.YOUTUBE_API_KEY;
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`
        );
        const data = await response.json();

        if (!data.items) {
            return new Response(JSON.stringify({ error: 'No videos found for channel' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        interface Snippet {
            title: string;
            description: string;
            thumbnails: {
            default: {
                url: string;
            };
            };
        }

        interface VideoItemResponse {
            snippet: Snippet;
            id: {
            videoId: string;
            };
        }

        const videos: VideoItem[] = (data.items as VideoItemResponse[]).map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            videoId: item.id.videoId
        }));

        return new Response(JSON.stringify({ videos }), {
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