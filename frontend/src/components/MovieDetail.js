import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchMovieById,
  getReviewsByMovie,
  submitReview
} from '../axios';
import { AuthContext } from '../AuthContext';

export default function MovieDetail() {
  const { imdbID } = useParams();
  const { user }   = useContext(AuthContext);

  const [movie, setMovie]     = useState(null);
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    fetchMovieById(imdbID).then(setMovie);
    getReviewsByMovie(imdbID).then(setReviews);
  }, [imdbID]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Please enter your review before submitting.');
      return;
    }

    console.log('Submitting review:', { movie: imdbID, content });

    try {
      const newRev = await submitReview(imdbID, content);
      setReviews(prev => [...prev, newRev]);
      setContent('');
    } catch (err) {
      console.error('Submission error response:', err.response?.data || err);
      setError(
        err.response?.data?.message ||
        'Failed to submit review. Check console for details.'
      );
    }
  };

  if (!movie) return <p>Loading…</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: 'auto' }}>
      <h1>{movie.Title} ({movie.Year})</h1>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
        alt={movie.Title}
        style={{ width: '100%', maxWidth: 300, marginBottom: '1rem' }}
      />
      <p>{movie.Plot}</p>

      <h2>Reviews</h2>
      {reviews.length ? (
        reviews.map(r => (
          <div
            key={r._id}
            style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}
          >
            <strong>{r.username}</strong>
            <p>{r.content}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      {user && (
        <>
          <h3>Write a Review</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <textarea
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem' }}
              placeholder="Your thoughts…"
            />
            <button type="submit">Submit Review</button>
          </form>
        </>
      )}
    </div>
  );
}
