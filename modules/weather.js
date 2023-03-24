'use strict';
const axios = require('axios');

let cache = {};


async function getWeather(request, response, next) {

  try {

    let lat = request.query.lat;
    let lon = request.query.lon;
    let citytName = request.query.searchQuery;
    let key = `lat: ${lat} lon: ${lon}- Weather`;

    if (cache[key] && (Date.now() - cache[key].timestamp) < 4.32e+7) {

      console.log('Weather cache was hit!', cache);

      response.status(200).send(cache[key].data);
    } else {
      console.log('No items in weatherCache');

      const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;

      let weather = await axios.get(url);

      let parsedweather = weather.data.data.map(day => new Forecast(day));

    }
    cache[key] = {
      data: parsedweather,
      timestamp: Date.now()
    };
    response.status(200).send(parsedweather);

  } catch (error) {
    next(error.message);
  }
}

class Forecast {
  constructor(dayObj) {
    // console.log(dayObj);
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
    this.lon = dayObj.lon;
    this.lat - dayObj.lat;
  }
}

module.exports = getWeather;

