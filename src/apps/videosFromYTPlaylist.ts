import fetch from 'node-fetch';

export default async function({ playlistId }) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.items) {
            return 'No videos found in playlist';
        }

        const videos = data.items.map(item => {
            const { title, description, thumbnails } = item.snippet;
            return {
                title,
                description,
                thumbnail: thumbnails.default.url,
                videoId: item.snippet.resourceId.videoId
            };
        });

        return JSON.stringify(videos, null, 2);
    } catch (error) {
        return `Error fetching playlist: ${error.message}`;
    }
}