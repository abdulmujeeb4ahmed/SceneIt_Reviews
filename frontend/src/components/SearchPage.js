import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies } from '../axios';

export default function SearchPage() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [error, setError]     = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!query.trim()) return;
    setError('');
    try {
      const movies = await searchMovies(query);
      setResults(movies);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Search For Movies</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type here to search"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>🔍</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {results.map(m => (
          <Link
            key={m.imdbID}
            to={`/movie/${m.imdbID}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={styles.card}>
              <img
                src={m.Poster !== 'N/A' ? m.Poster : '/placeholder.png'}
                alt={m.Title}
                style={styles.poster}
              />
              <div style={styles.meta}>
                <strong>{m.Title}</strong>
                <span> ({m.Year})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '2rem',
    maxWidth: 900,
    margin: '0 auto'
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    border: '2px solid #000',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: 'none',
    outline: 'none',
    fontSize: '1rem'
  },
  button: {
    padding: '0 1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '1rem'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: 4,
    overflow: 'hidden',
    textAlign: 'center',
    background: '#fff'
  },
  poster: {
    width: '100%',
    height: 200,
    objectFit: 'cover'
  },
  meta: {
    padding: '0.5rem'
  }
};
