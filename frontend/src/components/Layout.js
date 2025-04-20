import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  return (
    <>
      <nav style={styles.navbar}>
        <Link to="/"       style={styles.link}>Home</Link>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/myreviews" style={styles.link}>My Reviews</Link>
        {user ? (
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login"  style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}
      </nav>
      <main style={styles.main}>{children}</main>
    </>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#eef2ff',
    borderBottom: '1px solid #ccc',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  },
  button: {
    background: 'none',
    border: 'none',
    color: '#333',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  main: {
    padding: '20px'
  }
};

export default Layout;
