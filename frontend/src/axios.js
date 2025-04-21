import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: false
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function searchMovies(title, page = 1) {
  return instance.get('/omdb/search', { params: { title, page } }).then(r => r.data);
}

export function fetchMovieById(imdbID) {
  return instance.get(`/omdb/movie/${imdbID}`).then(r => r.data);
}

export function getReviewsByMovie(imdbID) {
  return instance.get(`/reviews/movie/${imdbID}`).then(r => r.data);
}

export function submitReview(movie, content) {
  return instance.post('/reviews', { movie, content }).then(r => r.data);
}

export function getMyReviews() {
  return instance.get('/reviews/user').then(r => r.data);
}

export function updateReview(id, content) {
  return instance.put(`/reviews/${id}`, { content }).then(r => r.data);
}

export function deleteReview(id) {
  return instance.delete(`/reviews/${id}`).then(r => r.data);
}

export function getAllReviews() {
  return instance.get('/reviews').then(r => r.data);
}

export default instance;