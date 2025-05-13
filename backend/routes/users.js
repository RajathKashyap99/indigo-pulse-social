
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// @route   GET api/users/suggested
// @desc    Get suggested users
// @access  Private
router.get('/suggested', auth, async (req, res) => {
  try {
    // Get current user's following list
    const currentUser = await User.findById(req.user.id);
    
    // Find users not being followed (exclude self)
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, req.user.id] 
      }
    })
    .select('username name avatar location followers following')
    .limit(5);
    
    // Format response
    const formattedUsers = await Promise.all(suggestedUsers.map(async (user) => {
      const postsCount = await Post.countDocuments({ author: user._id });
      
      return {
        _id: user._id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        location: user.location,
        followers: user.followers.length,
        following: user.following.length,
        posts: postsCount
      };
    }));
    
    res.json(formattedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:username
// @desc    Get user by username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const postsCount = await Post.countDocuments({ author: user._id });
    
    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      location: user.location,
      followers: user.followers.length,
      following: user.following.length,
      posts: postsCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:userId/posts
// @desc    Get posts by user ID
// @access  Public
router.get('/:userId/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name username avatar');
      
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }
  
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }
    
    // Add to following
    currentUser.following.push(req.params.id);
    await currentUser.save();
    
    // Add to followers
    userToFollow.followers.push(req.user.id);
    await userToFollow.save();
    
    res.json({ message: 'User followed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/:id/unfollow
// @desc    Unfollow a user
// @access  Private
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }
    
    // Remove from following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    await currentUser.save();
    
    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );
    await userToUnfollow.save();
    
    res.json({ message: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
