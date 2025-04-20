const express   = require('express');
const router    = express.Router();
const Review    = require('../models/Review');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, async (req, res) => {
  const { content, movie } = req.body;
  const username = req.user.username;
  const newReview = new Review({ content, movie, username });
  await newReview.save();
  res.status(201).json(newReview);
});

router.get('/', async (req, res) => {
  res.json(await Review.find());
});

router.get('/movie/:imdbID', async (req, res) => {
  res.json(await Review.find({ movie: req.params.imdbID }));
});

router.get('/user', authenticateUser, async (req, res) => {
  res.json(await Review.find({ username: req.user.username }));
});

module.exports = router;
