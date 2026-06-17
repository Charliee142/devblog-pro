/**
 * Post Controller
 *
 * TEACHING NOTE:
 * This controller handles all blog post CRUD operations.
 * Notice how we use async/await with try/catch everywhere.
 * Each function is exported individually for clear route mapping.
 */

const Post = require('../models/Post');
const Comment = require('../models/Comment');

// ========================
// @desc    Get all posts (with pagination and filters)
// @route   GET /api/posts
// @access  Public
// ========================
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const author = req.query.author;
    const search = req.query.search;

    let query = { status: 'published' };

    if (category) query.category = category;
    if (author) query.author = author;

    // Full text search
    if (search) {
      query.$text = { $search: search };
    }

    const result = await Post.getPaginatedPosts(query, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
// ========================
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'fullName username profilePicture bio')
      .populate('category', 'name slug color')
      .populate({
        path: 'commentCount',
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // Get comments for this post
    const comments = await Comment.find({ post: post._id })
      .populate('user', 'fullName username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      post,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Create post
// @route   POST /api/posts
// @access  Private
// ========================
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, status } = req.body;

    // Get featured image from upload if provided
    const featuredImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      status: status || 'published',
      featuredImage,
      author: req.user._id,
    });

    await post.populate('author', 'fullName username profilePicture');
    await post.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
// ========================
const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership — only author or admin can update
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const { title, content, category, tags, status } = req.body;

    const updateData = { title, content, category, status };
    if (tags) updateData.tags = tags.split(',').map((t) => t.trim());
    if (req.file) updateData.featuredImage = `/uploads/${req.file.filename}`;

    post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators on update
    })
      .populate('author', 'fullName username profilePicture')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
// ========================
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Only author or admin can delete
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Also delete all comments on this post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Like / Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
// ========================
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userId = req.user._id.toString();
    const isLiked = post.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like: add user to likes array
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      likeCount: post.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Get current user's posts
// @route   GET /api/posts/my-posts
// @access  Private
// ========================
const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Post.getPaginatedPosts(
      { author: req.user._id },
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Get featured/trending posts
// @route   GET /api/posts/featured
// @access  Public
// ========================
const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'fullName username profilePicture')
      .populate('category', 'name slug color')
      .sort({ views: -1, likes: -1 })
      .limit(6)
      .select('-content');

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts,
  getFeaturedPosts,
};
