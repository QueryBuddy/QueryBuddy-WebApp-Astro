import { URLSearchParams } from 'url';
import fetch from 'node-fetch';
const encodedParams = new URLSearchParams();

export default function({ target_url, swap_url }) {
  encodedParams.set('target_url', target_url);
  encodedParams.set('swap_url', swap_url);

  let url = 'https://api.magicapi.dev/api/v1/capix/faceswap/faceswap/v1/image';

  let options = {
    method: 'POST',
    headers: {
      'x-magicapi-key': process.env.MAGICAPI_API_KEY,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: encodedParams
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => {
      url = 'https://api.magicapi.dev/api/v1/capix/faceswap/result/';

      const encodedParams2 = new URLSearchParams();
      encodedParams2.set('request_id', json.image_process_response.request_id);
      options.body = encodedParams2

      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          json.image_process_response.result.embedding = ''
          json.image_process_response.result.keypoints = ''
          return json.image_process_response
        })
        .catch(err => console.error('error:' + err));
    })
    .catch(err => console.error('error:' + err));
}