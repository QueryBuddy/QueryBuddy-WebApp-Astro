interface ZipCodeResponse {
  zipCode: string;
  state: string;
  city: string;
}

export async function getZipCodeInfo(zipCode: string): Promise<ZipCodeResponse> {
  const url = `https://api.zippopotam.us/us/${zipCode}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Invalid zip code');
    }
    
    const data = await response.json();
    return {
      zipCode: data['post code'],
      state: data.places[0].state,
      city: data.places[0]['place name']
    };
  } catch (error) {
    throw new Error('Error fetching zip code info: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
} 