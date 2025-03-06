const express = require('express');
const router = express.Router();
const Thumb = require('../models/Thumb');
const Review = require('../models/Review');
const { authenticateUser } = require('../middleware/auth');

// POST: Add or toggle thumbs-up/thumbs-down
router.post('/:reviewId', authenticateUser, async (req, res) => {
    const { type } = req.body; // "up" or "down"
    const { reviewId } = req.params;
    const userId = req.user.id;

    if (!["up", "down"].includes(type)) {
        return res.status(400).json({ message: "Invalid reaction type" });
    }

    try {
        // Check if user has already reacted
        let thumb = await Thumb.findOne({ user: userId, review: reviewId });

        if (thumb) {
            if (thumb.type === type) {
                await Thumb.findByIdAndDelete(thumb._id);
                return res.json({ message: "Reaction removed" });
            }
            thumb.type = type;
            await thumb.save();
            return res.json({ message: "Reaction updated", thumb });
        }

        // Create new reaction
        const newThumb = new Thumb({ user: userId, review: reviewId, type });
        await newThumb.save();
        await Review.findByIdAndUpdate(reviewId, { $push: { thumbs: newThumb._id } });

        res.status(201).json({ message: "Reaction added", thumb: newThumb });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// GET: Count thumbs-up and thumbs-down for a review
router.get('/:reviewId/count', async (req, res) => {
    try {
        const { reviewId } = req.params;

        const thumbsUpCount = await Thumb.countDocuments({ review: reviewId, type: "up" });
        const thumbsDownCount = await Thumb.countDocuments({ review: reviewId, type: "down" });

        res.json({ thumbsUp: thumbsUpCount, thumbsDown: thumbsDownCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
