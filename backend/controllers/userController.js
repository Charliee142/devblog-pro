const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const posts = await Post.find({ author: user._id, status: 'published' })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-content');

    const postCount = await Post.countDocuments({ author: user._id });
    const commentCount = await Comment.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: { postCount, commentCount },
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, username, bio } = req.body;
    const updateData = { fullName, bio };

    if (username && username !== req.user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
      updateData.username = username;
    }

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [postCount, commentCount, posts] = await Promise.all([
      Post.countDocuments({ author: userId }),
      Comment.countDocuments({ user: userId }),
      Post.find({ author: userId })
        .populate('category', 'name slug color')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('-content'),
    ]);

    // Total likes across all user's posts
    const likesResult = await Post.aggregate([
      { $match: { author: userId } },
      { $project: { likeCount: { $size: '$likes' }, views: 1 } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$likeCount' },
          totalViews: { $sum: '$views' },
        },
      },
    ]);

    const totalLikes = likesResult[0]?.totalLikes || 0;
    const totalViews = likesResult[0]?.totalViews || 0;

    res.status(200).json({
      success: true,
      stats: { postCount, commentCount, totalLikes, totalViews },
      recentPosts: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateProfile, getDashboard };
