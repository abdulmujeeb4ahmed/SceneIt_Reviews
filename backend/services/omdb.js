const axios = require('axios');
const API_KEY = process.env.OMDB_API_KEY;

if (!API_KEY) {
  console.error('⚠️  No OMDB_API_KEY in .env');
}

async function searchMovies(title, page = 1) {
  const { data } = await axios.get('http://www.omdbapi.com/', {
    params: { s: title, page, apikey: API_KEY }
  });
  if (data.Response === 'False') {
    throw new Error(data.Error);
  }
  return data.Search;
}

async function fetchMovieById(imdbID) {
  const { data } = await axios.get('http://www.omdbapi.com/', {
    params: { i: imdbID, apikey: API_KEY, plot: 'full' }
  });
  if (data.Response === 'False') {
    throw new Error(data.Error);
  }
  return data;
}

module.exports = { searchMovies, fetchMovieById };
