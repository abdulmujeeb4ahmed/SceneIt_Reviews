const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

// Load .env config except in test
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Session Middleware
app.use(session({
  secret: 'sceneit_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set true if serving over HTTPS
}));

// Database Connection
const connectDB = async () => {
  const mongoUri = process.env.NODE_ENV === 'test'
    ? 'mongodb://127.0.0.1:27017/testdb'
    : process.env.MONGO_URI;

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to MongoDB (${process.env.NODE_ENV || 'development'})`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Import routes & services
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes   = require('./routes/userRoutes');
const thumbRoutes  = require('./routes/thumbRoutes');
const authRoutes   = require('./routes/authRoutes');
const { fetchMovieById, searchMovies } = require('./services/omdb');

// Route registration
app.use('/api/reviews', reviewRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/thumbs',   thumbRoutes);
app.use('/api/auth',     authRoutes);

// OMDb proxy endpoints

// Search movies by title
// GET /api/omdb/search?title=Batman&page=1
app.get('/api/omdb/search', async (req, res) => {
  try {
    const { title, page } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'title query is required' });
    }
    const results = await searchMovies(title, page);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch movie details by IMDb ID
// GET /api/omdb/movie/:imdbID
app.get('/api/omdb/movie/:imdbID', async (req, res) => {
  try {
    const movie = await fetchMovieById(req.params.imdbID);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;
