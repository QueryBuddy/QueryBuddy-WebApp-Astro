import fetch from 'node-fetch';
import states from '../states.json';

export default async function(req, res) {
  var apiKey = process.env['ZIPCODE_API_KEY'];
  
  var city = req.query.city
  var state = req.query.state
  state = states[state]

  try {
    const response = await fetch(`https://www.zipcodeapi.com/rest/${apiKey}/city-zips.json/${city}/${state}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching zipcode data:', error);
    res.status(500).json({ error: 'Failed to fetch zipcode data' });
  }
}