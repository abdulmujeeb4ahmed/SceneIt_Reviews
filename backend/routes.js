
const express = require('express');
const router = express.Router();

// Import route files
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const thumbRoutes = require('./routes/thumbRoutes');

// Use routes
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/thumbs', thumbRoutes);

module.exports = router;
