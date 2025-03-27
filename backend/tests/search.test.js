const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Review = require('../models/Review');

describe('Scenario 1: Search for a Movie', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should return movie details when searching', async () => {
    // Create test data
    await Review.create({
        content: 'A mind-bending movie',
        movie: 'Inception (2010)',
        username: 'testuser'
    });

    // Search with partial match
    const response = await request(app)
        .get('/api/reviews/search?movie=Inception')
        .expect(200);

    // Verify response
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].movie).toMatch(/Inception/i);
    expect(response.body[0].username).toBe('testuser');
  });
});