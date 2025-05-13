
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    user = new User({
      username,
      name,
      email,
      password
    });
    
    await user.save();
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          location: user.location,
          followers: [],
          following: [],
          posts: 0,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          location: user.location,
          followers: user.followers.length,
          following: user.following.length,
          posts: 0, // You would need to count this from posts collection
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/current
// @desc    Get current user
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      location: user.location,
      followers: user.followers.length,
      following: user.following.length,
      posts: 0, // You would need to count this from posts collection
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
