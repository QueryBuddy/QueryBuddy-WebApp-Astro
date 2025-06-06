export default async function({ channelId }: { channelId: string }) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.items) {
            return 'No videos found for channel';
        }

        const videos = data.items.map((item: { snippet: { title: string, description: string, thumbnails: { default: { url: string } } }, id: { videoId: string } }) => {
            const { title, description, thumbnails } = item.snippet;
            return {
                title,
                description,
                thumbnail: thumbnails.default.url,
                videoId: item.id.videoId
            };
        });

        return JSON.stringify(videos, null, 2);
    } catch (error) {
        return `Error fetching channel videos: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}