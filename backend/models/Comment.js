const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must belong to a post'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [2, 'Comment must be at least 2 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by post
CommentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
