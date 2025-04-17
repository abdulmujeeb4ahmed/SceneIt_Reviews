import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Reviews from './components/Reviews';

const App = () => {
  return (
    <Router>
      <div>
        <nav style={styles.navbar}>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/signup" style={styles.link}>Signup</Link>
          <Link to="/reviews" style={styles.link}>Reviews</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#e0e0e0',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #ccc',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
  }
};

export default App;