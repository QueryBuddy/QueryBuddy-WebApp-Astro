import fetch from 'node-fetch';

import getCountry from './country.js'

var unitsObj = {
  C: 'Metric', 
  F: 'Imperial', 
}

export default async function(req, res) {
  var apiKey = process.env['OPENWEATHER_API_KEY'];
  
  var latitude = req.query.lat
  var longitude = req.query.lon

  var country = getCountry(latitude, longitude)

  if (country === 'ERROR') {
    res.status(500).send('Error fetching weather data');
    return
  }

  var unit = 'C'
  if (country === 'US') unit = 'F'

  var unit = unitsObj[unit]

  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`

  try {
    const response = await fetch(url);
    const body = await response.json();
    res.send(body)
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Error fetching weather data');
  }
}