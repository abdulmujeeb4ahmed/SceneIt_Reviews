import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h1>Welcome to <br />SceneIt Reviews!</h1>
        <p>Click below to either log in or view other users' reviews</p>
        <div style={styles.buttonContainer}>
          <button style={styles.primaryButton} onClick={() => navigate('/signup')}>Join Now</button>
          <button style={styles.secondaryButton} onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.phoneFrame}>
          <img src="/images/ironman.jpg" alt="Iron Man" style={styles.poster} />
          <img src="/images/starwars.jpg" alt="Star Wars" style={styles.poster} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    padding: '40px',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  left: {
    flex: 1,
    minWidth: '300px'
  },
  right: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    justifyContent: 'center'
  },
  phoneFrame: {
    border: '2px solid #ccc',
    borderRadius: '30px',
    padding: '10px',
    width: '200px',
    height: '400px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  poster: {
    width: '100%',
    marginBottom: '10px',
    borderRadius: '8px'
  },
  buttonContainer: {
    marginTop: '20px'
  },
  primaryButton: {
    marginRight: '10px',
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid black',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default HomePage;
