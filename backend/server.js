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
  cookie: { secure: false } // Only true in HTTPS
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

// Routes
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const thumbRoutes = require('./routes/thumbRoutes');
const authRoutes = require('./routes/authRoutes'); 

app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/thumbs', thumbRoutes);
app.use('/api/auth', authRoutes); 

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