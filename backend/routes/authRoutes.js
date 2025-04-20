const express = require('express');
const md5     = require('md5');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { authenticateUser } = require('../middleware/auth');
const router  = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey';
const JWT_EXPIRES = '2h';

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username & password required' });
  }
  if (await User.findOne({ username })) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = await new User({
    username,
    password: md5(password)
  }).save();

  const token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
  res.status(201).json({
    user: { id: newUser._id, username: newUser.username },
    token
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username & password required' });
  }
  const user = await User.findOne({
    username,
    password: md5(password)
  });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
  res.json({
    user: { id: user._id, username: user.username },
    token
  });
});

router.get('/me', authenticateUser, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username } });
});

module.exports = router;
