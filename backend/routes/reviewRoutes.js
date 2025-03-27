const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateUser } = require('../middleware/auth');

// Create a new review
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { content, movie } = req.body;
    const username = req.user.username;

    const newReview = new Review({ content, movie, username });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error });
  }
});

// Search reviews by movie title (case-insensitive partial match)
router.get('/search', async (req, res) => {
  try {
    const { movie } = req.query;

    if (!movie) {
      return res.status(400).json({ message: 'Movie title is required' });
    }

    const reviews = await Review.find({
      movie: { $regex: movie, $options: 'i' } // Case-insensitive partial match
    });

    // If no reviews are found, return a 404 error with a custom message
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(reviews);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching reviews', error });
  }
});


// Get a single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving review', error });
  }
});

// Update a review by ID
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    // Ensure only the review owner can update the review
    if (review.username !== req.user.username) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }
    review.content = req.body.content || review.content;
    await review.save();
    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
});

module.exports = router;
