'use strict';

// *** REQUIRES *** (Like import )

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let weather = require('./data/weather.json');
// *** ONCE WE BRING IN EXPRESS WE CALL IT TO CREATE THE SERVER
const app = express();
const axios = require('axios');


// ** MIDDLEWARE - CORS ***
app.use(cors());
// *** PORT THAT SERVER LIVES ON
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`We are running on port ${PORT}`));

// *** ENDPOINTS ****

// ** BASE ENDPOINT - PROOF OF LIFE
// ** 1st arg - string url in quotes
// ** 2nd arg - callback that will execute when that endpoint is hit

app.get('/', (request, response) => {
  response.status(200).setDefaultEncoding('Welcome to my server!');
});

// ** BUILD AN ENDPOINT THAT WILL CALL OUT TO AN API

app.get('/hello', (request, response) => {
  let userFirstName = request.query.firstName;
  let userLastName = request.query.lastName;

  response.status(200).send(`Hello ${userFirstName} ${userLastName}! Welcome to my server!`);
});



let getWeather = async (request, response, next) => {
  // console.log('this is the request', request);
  try {
    //  /weather?lat=Value&lon=Value&SearchQuery=Value
  
    let lat = request.query.lat;
    let lon = request.query.lon;
    let citytName = request.query.searchQuery;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;
    // console.log(url);
    let weather = await axios.get(url);
    // let parsedweather = new Forecast(weather.data)
    // console.log('----->', weather.data.data, '<-----');

   let parsedweather = weather.data.data.map(dayObj => {

    let newForecast = new Forecast(dayObj);
return newForecast;
   });




    // let city = weather.find(city => city.city_name.toLowerCase() === citytName.toLowerCase());
    // let weatherToSend = city.data.map(day => new Forecast(day));
    // console.log('----->', parsedweather, '<-----');
    response.status(200).send(parsedweather);


  } catch (error) {
    next(error.message);
  }

};
app.get('/weather', getWeather)

app.get('/movies', async (request, response, next)  => {

  try {

    let cityInfo = request.query.searchQuery;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityInfo}`;
    console.log(url);

    const movieResults = await axios.get(url);
    console.log(movieResults.data.results);

    let movieInfo = movieResults.data.results.map(movie => new Movie(movie));
    console.log(movieInfo);
    response.status(200).send(movieInfo);

  } catch (error) {
    next(error.message);
  }




});




// Class to groom bulk data
class Forecast {
  constructor(dayObj) {
    // console.log(dayObj);
    this.date = dayObj.valid_date;
    // this.description = dayObj.weather.description;
  }
}

class Movie {
constructor(movieObj) {

this.title = movieObj.title,
this.overview = movieObj.overview;
this.image = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
}
}








// *** CATCH ALL - AT THE BOTTOM SERVING AS A 404 ERROR  

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

// ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ***

app.use((error, request, response, next) => {

  response.status(500).send(error.message);
});
