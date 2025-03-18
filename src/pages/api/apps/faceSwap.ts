import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { target_url, swap_url } = await request.json();

    if (!target_url || !swap_url) {
      return new Response(JSON.stringify({ error: 'Missing target_url or swap_url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const params = new URLSearchParams();
    params.set('target_url', target_url);
    params.set('swap_url', swap_url);

    const options = {
      method: 'POST',
      headers: {
        'x-magicapi-key': import.meta.env.MAGICAPI_API_KEY,
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: params
    };

    // First request to initiate face swap
    const initResponse = await fetch(
      'https://api.magicapi.dev/api/v1/capix/faceswap/faceswap/v1/image',
      options
    );
    const initData = await initResponse.json();

    // Second request to get results
    const resultParams = new URLSearchParams();
    resultParams.set('request_id', initData.image_process_response.request_id);
    options.body = resultParams;

    const resultResponse = await fetch(
      'https://api.magicapi.dev/api/v1/capix/faceswap/result/',
      options
    );
    const resultData = await resultResponse.json();

    // Clean up response data
    const result = resultData.image_process_response;
    if (result.result) {
      result.result.embedding = '';
      result.result.keypoints = '';
    }

    return new Response(JSON.stringify(result), {
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