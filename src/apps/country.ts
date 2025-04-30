export default async function({ lat, lon }: { lat: number, lon: number }) {
  var apiKey = process.env.OPENWEATHER_API_KEY;
  
  var url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`

  try {
    const response = await fetch(url);
    const body = await response.json();
    return body[0];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return 'ERROR'
  }
}