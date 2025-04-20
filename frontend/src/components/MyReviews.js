import React, { useEffect, useState, useContext } from 'react';
import { getMyReviews } from '../axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function MyReviews() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user) getMyReviews().then(setReviews);
  }, [user]);

  if (!user) return <p>Please <Link to="/login">log in</Link> first.</p>;

  return (
    <div style={{ padding:'2rem', maxWidth:800, margin:'auto' }}>
      <h1>My Reviews</h1>
      {reviews.length ? (
        reviews.map(r => (
          <div
            key={r._id}
            style={{
              border:'1px solid #ddd',
              padding:'1rem',
              marginBottom:'1rem'
            }}
          >
            <Link to={`/movie/${r.movie}`} style={{ textDecoration:'none' }}>
              <strong>Movie: {r.movie}</strong>
            </Link>
            <p>{r.content}</p>
          </div>
        ))
      ) : (
        <p>You haven’t written any reviews yet.</p>
      )}
    </div>
  );
}
