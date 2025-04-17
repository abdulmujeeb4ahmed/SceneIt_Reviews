const express = require('express');
const md5 = require('md5');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ username, password: md5(password) });
    await newUser.save();

    req.session.user = newUser;
    res.status(201).json({ message: 'Signup successful', user: newUser.username });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password: md5(password) });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.user = user;
  res.json({ message: 'Login successful', user: user.username });
});

// Check session
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user.username });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;