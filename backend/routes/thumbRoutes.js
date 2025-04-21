const express = require('express');
const router = express.Router();
const Thumb = require('../models/Thumb');
const Review = require('../models/Review');
const { authenticateUser } = require('../middleware/auth');

router.post('/:reviewId', authenticateUser, async (req, res) => {
  const { type } = req.body;
  const { reviewId } = req.params;
  const userId = req.user.id;
  let thumb = await Thumb.findOne({ user: userId, review: reviewId });
  if (thumb) {
    if (thumb.type === type) {
      await Thumb.findByIdAndDelete(thumb._id);
      return res.json({ removed: true });
    }
    thumb.type = type;
    await thumb.save();
    return res.json(thumb);
  }
  const newThumb = new Thumb({ user: userId, review: reviewId, type });
  await newThumb.save();
  await Review.findByIdAndUpdate(reviewId, { $push: { thumbs: newThumb._id } });
  res.status(201).json(newThumb);
});

router.get('/:reviewId/count', async (req, res) => {
  const { reviewId } = req.params;
  const thumbsUp = await Thumb.countDocuments({ review: reviewId, type: 'up' });
  const thumbsDown = await Thumb.countDocuments({ review: reviewId, type: 'down' });
  res.json({ thumbsUp, thumbsDown });
});

module.exports = router;
