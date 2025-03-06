const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const thumbRoutes = require('./routes/thumbRoutes');

// Use routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/thumbs', thumbRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

const PORT = process.env.PORT || 5001;  // Ensure frontend is pointing to this port
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
