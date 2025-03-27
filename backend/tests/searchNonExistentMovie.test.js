const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Scenario 2: Search for a Non-Existent Movie', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should return an error message when searching for a non-existent movie', async () => {
    const response = await request(app)
      .get('/api/reviews/search?movie=NonExistentMovie')
      .expect(404);

    // Verify response
    expect(response.body).toHaveProperty('error', 'Movie not found');
  });
});
