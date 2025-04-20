import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './AuthContext';
import Layout          from './components/Layout';
import HomePage        from './components/HomePage';
import Login           from './components/Login';
import Signup          from './components/Signup';
import Reviews         from './components/Reviews';
import SearchPage      from './components/SearchPage';
import MovieDetail     from './components/MovieDetail';
import MyReviews       from './components/MyReviews';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/login"        element={<Login />}    />
            <Route path="/signup"       element={<Signup />}   />
            <Route path="/reviews"      element={<Reviews />}  />
            <Route path="/search"       element={<SearchPage />} />
            <Route path="/movie/:imdbID" element={<MovieDetail />} />
            <Route path="/myreviews"    element={<MyReviews />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
