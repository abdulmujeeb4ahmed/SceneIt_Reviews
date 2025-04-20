const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: { type: String, required: true },
  movie: { type: String, required: true },
  username: { type: String, required: true },
  thumbs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thumb' }]
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
