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

module.exports = router;
