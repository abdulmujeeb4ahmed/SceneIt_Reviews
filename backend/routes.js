
const express = require('express');
const router = express.Router();

const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const thumbRoutes = require('./routes/thumbRoutes');

router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/thumbs', thumbRoutes);

module.exports = router;
