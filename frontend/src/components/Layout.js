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
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/myreviews" style={styles.link}>My Reviews</Link>
        {user && (
          <button
            onClick={handleLogout}
            style={{ ...styles.link, ...styles.logout }}
          >
            Logout
          </button>
        )}
      </nav>
      <main style={styles.main}>{children}</main>
    </>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#f1f5f9',
    borderBottom: '1px solid #ccc',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  link: {
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: 4
  },
  logout: {
    backgroundColor: '#ef4444',
    color: 'white',
    transition: 'background-color 0.2s ease'
  },
  main: {
    padding: '20px'
  }
};

export default Layout;
