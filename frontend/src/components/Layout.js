import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <nav style={styles.navbar}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/search" style={styles.link}>Search</Link>
        {user ? (
          <>
            <Link to="/myreviews" style={styles.link}>My Reviews</Link>
            <button onClick={handleLogout} style={{ ...styles.link, ...styles.logout }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
            <Link to="/login" style={styles.link}>Login</Link>
          </>
        )}
      </nav>
      <main style={styles.main}>{children}</main>
    </>
  )
}

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
    color: 'white'
  },
  main: {
    padding: '20px'
  }
}
