/**
 * Auth Routes Tests
 *
 * TEACHING NOTE:
 * Testing is a professional skill. We use:
 * - Jest: Test runner
 * - Supertest: HTTP assertions for Express
 *
 * Run: npm test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devblog-test');
});

afterAll(async () => {
  await User.deleteMany({ email: /test@/ });
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        username: 'testuser123',
        email: 'test@example.com',
        password: 'Test123!',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.password).toBeUndefined(); // Password never returned
  });

  it('should fail with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User 2',
        username: 'testuser456',
        email: 'test@example.com', // Same email
        password: 'Test123!',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        username: 'testuser789',
        email: 'not-an-email',
        password: 'Test123!',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'WrongPassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user when authenticated', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should fail without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
