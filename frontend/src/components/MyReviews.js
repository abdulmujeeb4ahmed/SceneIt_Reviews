import React, { useEffect, useState, useContext } from 'react';
import { getMyReviews, fetchMovieById } from '../axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function MyReviews() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [titles, setTitles]   = useState({});

  useEffect(() => {
    if (!user) return;
    getMyReviews()
      .then(setReviews)
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    reviews.forEach(r => {
      const id = r.movie;
      if (!titles[id]) {
        fetchMovieById(id)
          .then(movie => {
            setTitles(prev => ({ ...prev, [id]: movie.Title }));
          })
          .catch(err => {
            console.error(`Couldn’t load title for ${id}`, err);
            setTitles(prev => ({ ...prev, [id]: id }));
          });
      }
    });
  }, [reviews, titles]);

  if (!user) {
    return (
      <div style={{ padding:'2rem', maxWidth:800, margin:'auto' }}>
        <p>Please <Link to="/login">log in</Link> first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding:'2rem', maxWidth:800, margin:'auto' }}>
      <h1>My Reviews</h1>

      {reviews.length > 0 ? (
        reviews.map(r => (
          <div
            key={r._id}
            style={{
              border: '1px solid #ddd',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >
            <Link
              to={`/movie/${r.movie}`}
              style={{ textDecoration:'none', color:'#4B0082' }}
            >
              <strong>
                Movie: {titles[r.movie] || 'Loading title…'}
              </strong>
            </Link>
            <p style={{ marginTop: '0.5rem' }}>{r.content}</p>
          </div>
        ))
      ) : (
        <p>You haven’t written any reviews yet.</p>
      )}
    </div>
  );
}
