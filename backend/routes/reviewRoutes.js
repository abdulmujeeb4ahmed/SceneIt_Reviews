const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, async (req, res) => {
  const { content, movie } = req.body;
  const username = req.user.username;
  const newReview = new Review({ content, movie, username });
  await newReview.save();
  res.status(201).json(newReview);
});

router.get('/', async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

router.get('/movie/:imdbID', async (req, res) => {
  const reviews = await Review.find({ movie: req.params.imdbID });
  res.json(reviews);
});

router.get('/user', authenticateUser, async (req, res) => {
  const reviews = await Review.find({ username: req.user.username });
  res.json(reviews);
});

router.put('/:id', authenticateUser, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review.username !== req.user.username) return res.status(403).json({ message: 'Not authorized' });
  review.content = req.body.content || review.content;
  await review.save();
  res.json(review);
});

router.delete('/:id', authenticateUser, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review.username !== req.user.username) return res.status(403).json({ message: 'Not authorized' });
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
