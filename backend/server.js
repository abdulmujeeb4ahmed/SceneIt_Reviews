const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Only load .env file in non-test environments
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
  const mongoUri = process.env.NODE_ENV === 'test'
    ? 'mongodb://127.0.0.1:27017/testdb' // Local test database
    : process.env.MONGO_URI; // Your real Atlas URI from .env

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to MongoDB (${process.env.NODE_ENV || 'development'})`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Routes
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const thumbRoutes = require('./routes/thumbRoutes');

app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/thumbs', thumbRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
  });
}

// Export for testing
module.exports = app;