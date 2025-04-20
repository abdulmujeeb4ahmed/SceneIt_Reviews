import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav('/');
  }, [user, nav]);

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      await login({ username, password });
      nav('/');
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <div style={container}>
      <h2>Login</h2>
      {err && <p style={error}>{err}</p>}
      <form onSubmit={handleSubmit} style={form}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
        />
        <button type="submit" style={button}>Log In</button>
      </form>
      <p style={{ marginTop: 10 }}>
        Need an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

const container = {
  maxWidth: 400, margin: '60px auto', padding: 30,
  border: '1px solid #ddd', borderRadius: 8
};
const form = { display: 'flex', flexDirection: 'column', gap: 15 };
const input = { padding: 10, fontSize: 16 };
const button = {
  padding: 10, fontSize: 16,
  backgroundColor: '#1e88e5', color: 'white',
  border: 'none', cursor: 'pointer', borderRadius: 4
};
const error = { color: 'red', marginBottom: 10 };
