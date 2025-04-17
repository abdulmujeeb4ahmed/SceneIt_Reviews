const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'sceneit_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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

const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes   = require('./routes/userRoutes');
const thumbRoutes  = require('./routes/thumbRoutes');
const authRoutes   = require('./routes/authRoutes');
const { fetchMovieById, searchMovies } = require('./services/omdb');

app.use('/api/reviews', reviewRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/thumbs',   thumbRoutes);
app.use('/api/auth',     authRoutes);

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

app.get('/api/omdb/movie/:imdbID', async (req, res) => {
  try {
    const movie = await fetchMovieById(req.params.imdbID);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;