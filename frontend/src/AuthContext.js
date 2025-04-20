import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return;
    axios.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  const signup = async creds => {
    const { data } = await axios.post('/auth/signup', creds);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };
  const login = async creds => {
    const { data } = await axios.post('/auth/login', creds);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
