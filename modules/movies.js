'use strict';
const axios = require('axios');

let cache = {};

async function getMovies(request, response, next) {

  try {

    let cityInfo = request.query.searchQuery;

    let key = `${cityInfo}-Movie`;

    if (cache[key] && (Date.now() - cache[key].timestamp) < 10000) {
      console.log('cache was hit!, cache');

      response.status(200).send(cache[key].data);

    } else {
      console.log('No items in moviesCache');

      const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityInfo}`;

      const movieResults = await axios.get(url);

      let movieInfo = movieResults.data.results.map(movie => new Movie(movie));

      cache[key] = {
        data: movieInfo,
        timestamp: Date.now()
      };

      response.status(200).send(movieInfo);
    };

  } catch (error) {
    next(error.message);
  }
};

class Movie {
  constructor(movieObj) {

    this.title = movieObj.title,
      this.overview = movieObj.overview;
    this.image = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
  }
}

module.exports = getMovies;









