import states from '../lib/states.json';

export default async function({ city, state }: { city: string, state: string }) {
  var apiKey = process.env['ZIPCODE_API_KEY'];
  
  state = states[state as keyof typeof states]

  try {
    const response = await fetch(`https://www.zipcodeapi.com/rest/${apiKey}/city-zips.json/${city}/${state}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return 'Failed to fetch zipcode data';
  }
}