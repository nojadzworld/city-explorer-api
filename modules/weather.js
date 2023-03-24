'use strict';
const axios = require('axios');

async function getWeather(request, response, next) {

  try {

    let lat = request.query.lat;
    let lon = request.query.lon;
    let citytName = request.query.searchQuery;

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
   console.log(url);
    let weather = await axios.get(url);

    let parsedweather = weather.data.data.map(day => new Forecast(day));

    response.status(200).send(parsedweather);
  } catch (error) {
 next(error.message);
  }}

  class Forecast {
    constructor(dayObj) {
      // console.log(dayObj);
      this.date = dayObj.valid_date;
      this.description = dayObj.weather.description;
    }
  }

  module.exports = getWeather;

