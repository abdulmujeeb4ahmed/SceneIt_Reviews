const mongoose = require('mongoose');

const thumbSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  type: { type: String, enum: ['up', 'down'], required: true }
}, { timestamps: true });

// Prevent users from reacting multiple times to the same review
thumbSchema.index({ user: 1, review: 1 }, { unique: true });

module.exports = mongoose.model('Thumb', thumbSchema);
