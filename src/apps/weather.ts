import getCountry from './country.js'

var unitsObj = {
  C: 'Metric', 
  F: 'Imperial', 
}

export default async function({ latitude, longitude }: { latitude: number, longitude: number }) {
  var apiKey = process.env['OPENWEATHER_API_KEY'];
  
  var country = await getCountry({ lat: latitude, lon: longitude })

  if (country === 'ERROR') {
    return { error: 'Error fetching weather data' };
  }

  var unit = 'C'
  if (country === 'US') unit = 'F'

  var unitType = unitsObj[unit as keyof typeof unitsObj]

  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unitType}&appid=${apiKey}`

  try {
    const response = await fetch(url);
    const body = await response.json();
    return body;
  } catch (error) {
    return { error: 'Error fetching weather data' };
  }
}