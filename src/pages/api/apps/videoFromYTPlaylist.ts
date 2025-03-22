import type { APIRoute } from 'astro';

interface VideoItem {
    title: string;
    description: string;
    thumbnail: string;
    videoId: string;
}

export const GET: APIRoute = async ({ url }) => {
    const playlistId = url.searchParams.get('playlistId');

    if (!playlistId) {
        return new Response(JSON.stringify({ error: 'Missing playlist ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const apiKey = import.meta.env.YOUTUBE_API_KEY;
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
        );
        const data = await response.json();

        if (!data.items) {
            return new Response(JSON.stringify({ error: 'No videos found in playlist' }), {
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
            resourceId: {
            videoId: string;
            };
        }

        interface PlaylistItem {
            snippet: Snippet;
        }

        interface PlaylistResponse {
            items: PlaylistItem[];
        }

        const playlistData: PlaylistResponse = await response.json();

        const videos: VideoItem[] = playlistData.items.map((item: PlaylistItem) => ({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            videoId: item.snippet.resourceId.videoId
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