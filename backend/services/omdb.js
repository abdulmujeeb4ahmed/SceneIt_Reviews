const axios = require('axios');
const API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

async function fetchMovieById(imdbID) {
  const url = `${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`;
  const { data } = await axios.get(url);
  if (data.Response === 'False') {
    throw new Error(data.Error);
  }
  return data;
}

async function searchMovies(title, page = 1) {
  const url = `${BASE_URL}?s=${encodeURIComponent(title)}&page=${page}&apikey=${API_KEY}`;
  const { data } = await axios.get(url);
  if (data.Response === 'False') {
    throw new Error(data.Error);
  }
  return data.Search;
}

module.exports = { fetchMovieById, searchMovies };
