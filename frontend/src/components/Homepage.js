import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        {user && (
          <p style={styles.greeting}>
            Hello, <strong>{user.username}</strong>!
          </p>
        )}
        <h1 style={styles.title}>
          Welcome to<br />SceneIt Reviews!
        </h1>
        <p style={styles.subtitle}>
          Click below to either log in or view other users' reviews
        </p>
        <div style={styles.buttonContainer}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate('/signup')}
          >
            Join Now
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
        <div style={styles.indicators}>
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              style={{
                ...styles.dot,
                ...(i === 0 ? styles.dotActive : {})
              }}
            />
          ))}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.phoneFrame}>
          <img
            src="/images/ironman.jpg"
            alt="Iron Man"
            style={styles.posterTop}
          />
          <img
            src="/images/starwars.jpg"
            alt="Star Wars"
            style={styles.posterBottom}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    padding: '40px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    fontFamily: 'sans-serif',
    maxWidth: 1200,
    margin: '0 auto'
  },
  left: {
    flex: 1,
    minWidth: 300,
    maxWidth: '50%'
  },
  greeting: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#333'
  },
  title: {
    fontSize: '3rem',
    lineHeight: 1.2,
    margin: 0
  },
  subtitle: {
    marginTop: '1rem',
    fontSize: '1.125rem',
    color: '#555'
  },
  buttonContainer: {
    marginTop: '2rem',
    display: 'flex',
    gap: '1rem'
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid black',
    borderRadius: 6,
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  indicators: {
    marginTop: 20,
    display: 'flex',
    gap: 8
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#D1D5DB',
    borderRadius: '50%'
  },
  dotActive: {
    backgroundColor: '#9CA3AF'
  },
  right: {
    flex: 1,
    minWidth: 300,
    maxWidth: '40%',
    display: 'flex',
    justifyContent: 'center'
  },
  phoneFrame: {
    width: 260,
    height: 520,
    border: '4px solid #E5E7EB',
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  posterTop: {
    width: '100%',
    height: '60%',
    objectFit: 'cover'
  },
  posterBottom: {
    width: '100%',
    height: '35%',
    objectFit: 'cover',
    objectPosition: 'center bottom'
  }
};
