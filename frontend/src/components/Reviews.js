import React, { useEffect, useState } from 'react';
import { getAllReviews } from '../axios';
import { Link } from 'react-router-dom';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAllReviews()
      .then(setReviews)
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  return (
    <div style={container}>
      <h1>All Reviews</h1>
      {reviews.length ? reviews.map(r => (
        <div key={r._id} style={card}>
          <Link to={`/movie/${r.movie}`} style={movieLink}>
            Movie: {r.movie}
          </Link>
          <p><strong>{r.username}</strong>: {r.content}</p>
        </div>
      )) : (
        <p>No reviews have been posted yet.</p>
      )}
    </div>
  );
}

const container = {
  padding: '2rem', maxWidth: 800, margin: 'auto', fontFamily: 'sans-serif'
};
const card = {
  border: '1px solid #ddd', borderRadius: 4,
  padding: '1rem', marginBottom: '1rem', background: '#fafafa'
};
const movieLink = {
  fontWeight: 'bold', textDecoration: 'none', color: '#333'
};
