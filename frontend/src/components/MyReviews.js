import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
  getMyReviews,
  fetchMovieById,
  updateReview,
  deleteReview
} from '../axios';

export default function MyReviews() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [titles, setTitles] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (user) {
      getMyReviews().then(setReviews).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    reviews.forEach(r => {
      if (!titles[r.movie]) {
        fetchMovieById(r.movie)
          .then(m => setTitles(prev => ({ ...prev, [r.movie]: m.Title })))
          .catch(() => setTitles(prev => ({ ...prev, [r.movie]: r.movie })));
      }
    });
  }, [reviews, titles]);

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: 800, margin: 'auto' }}>
        <p>Please <Link to="/login">log in</Link> first.</p>
      </div>
    );
  }

  const handleSave = async id => {
    const res = await updateReview(id, editContent);
    const updated = res.review || res;
    setReviews(reviews.map(r => r._id === id ? updated : r));
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = async id => {
    await deleteReview(id);
    setReviews(reviews.filter(r => r._id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: 'auto' }}>
      <h1>My Reviews</h1>
      {reviews.length > 0 ? reviews.map(r => (
        <div
          key={r._id}
          style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}
        >
          <Link
            to={`/movie/${r.movie}`}
            style={{ textDecoration: 'none', color: '#4B0082' }}
          >
            <strong>Movie: {titles[r.movie] || 'Loading…'}</strong>
          </Link>

          {editingId === r._id ? (
            <>
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => handleSave(r._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ marginTop: '0.5rem' }}>{r.content}</p>
              <div>
                <button onClick={() => { setEditingId(r._id); setEditContent(r.content); }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(r._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      )) : (
        <p>You haven’t written any reviews yet.</p>
      )}
    </div>
  );
}