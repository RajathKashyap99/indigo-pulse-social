
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const multer = require('multer');
const AWS = require('aws-sdk');

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const upload = multer();

// @route   GET api/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name username avatar')
      .lean();
      
    // Add likes count and comments count
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      const commentsCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post,
        likes: post.likes.length,
        comments: commentsCount
      };
    }));
    
    res.json(postsWithCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username avatar')
      .lean();
      
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Add comments count
    const commentsCount = await Comment.countDocuments({ post: post._id });
    
    res.json({
      ...post,
      likes: post.likes.length,
      comments: commentsCount
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, upload.array('images', 5)], async (req, res) => {
  try {
    const { content, tags } = req.body;
    const imageUrls = [];
    
    // Upload images to S3 if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `posts/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read'
        };
        
        const uploadResult = await s3.upload(params).promise();
        imageUrls.push(uploadResult.Location);
      }
    }
    
    const newPost = new Post({
      content,
      images: imageUrls,
      author: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    const post = await newPost.save();
    await post.populate('author', 'name username avatar');
    
    res.json({
      ...post.toObject(),
      likes: 0,
      comments: 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });
    
    // Delete the post
    await post.remove();
    
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/like
// @desc    Like a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    
    post.likes.push(req.user.id);
    await post.save();
    
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.post('/:id/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the post has been liked by this user
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post has not yet been liked' });
    }
    
    // Remove the like
    post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    await post.save();
    
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id/comments
// @desc    Get comments for a post
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name username avatar');
      
    res.json(comments.map(comment => ({
      ...comment.toObject(),
      likes: comment.likes.length
    })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newComment = new Comment({
      content: req.body.content,
      author: req.user.id,
      post: req.params.id
    });
    
    const comment = await newComment.save();
    await comment.populate('author', 'name username avatar');
    
    res.json({
      ...comment.toObject(),
      likes: 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
