const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Scenario: Edit review for Iron Man', () => {
  let token;
  let reviewId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb_edit');

    // Clear any existing test data
    await Review.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = await User.create({
      username: 'testuser',
      password: hashedPassword,
    });

    // Generate token
    token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    // Insert a sample review for Iron Man with a rating of 4/5 stars (stored in content)
    const review = await Review.create({
      content: 'Review for Iron Man: 4/5 stars',
      movie: 'Iron Man',
      username: 'testuser',
      thumbs: []
    });
    reviewId = review._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should allow the user to view and edit their review for Iron Man', async () => {
    // User views all reviews
    const response = await request(app)
      .get('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Find the review for Iron Man by testuser
    const ironManReview = response.body.find(review =>
      review._id.toString() === reviewId.toString() &&
      review.movie === 'Iron Man' &&
      review.username === 'testuser'
    );
    expect(ironManReview).toBeDefined();
    expect(ironManReview.content).toContain('4/5 stars');

    // User edits their review to update the rating from 4/5 to 3/5 stars.
    const updatedContent = 'Review for Iron Man: 3/5 stars';
    const updateResponse = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: updatedContent })
      .expect(200);

    // Verify the update response
    expect(updateResponse.body.message).toBe('Review updated');
    expect(updateResponse.body.review.content).toBe(updatedContent);

    // Fetch the review again to confirm the change
    const fetchResponse = await request(app)
      .get(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(fetchResponse.body.content).toBe(updatedContent);
  });
});
