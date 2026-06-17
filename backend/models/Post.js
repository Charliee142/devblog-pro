/**
 * Post Model
 *
 * TEACHING NOTE:
 * This model demonstrates:
 * - References to other collections (author, category)
 * - Auto-generating slugs from titles
 * - Array fields (likes)
 * - Pre-save hooks
 * - Static methods for complex queries
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      minlength: [50, 'Content must be at least 50 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot exceed 200 characters'],
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Post category is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post author is required'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number, // in minutes
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ========================
// INDEXES
// ========================

/**
 * TEACHING NOTE: Indexes
 * Indexes speed up query performance dramatically.
 * Without an index, MongoDB scans every document (O(n)).
 * With an index, it uses a B-tree data structure (O(log n)).
 *
 * Text index allows full-text search on title and content.
 */
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ createdAt: -1 }); // -1 = descending (newest first)

// ========================
// VIRTUALS
// ========================

// Virtual: get comment count
PostSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

// Virtual: get like count
PostSchema.virtual('likeCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// ========================
// PRE-SAVE HOOKS
// ========================

PostSchema.pre('save', function (next) {
  // Auto-generate slug from title
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  // Auto-generate excerpt from content
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }

  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  next();
});

// ========================
// STATIC METHODS
// ========================

// Get posts with pagination
PostSchema.statics.getPaginatedPosts = async function (
  query = {},
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;
  const total = await this.countDocuments(query);

  const posts = await this.find(query)
    .populate('author', 'fullName username profilePicture')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-content'); // Exclude full content for lists

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalPosts: total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };
};

// Full-text search
PostSchema.statics.searchPosts = async function (searchTerm, page = 1, limit = 10) {
  const query = {
    $text: { $search: searchTerm },
    status: 'published',
  };

  return this.getPaginatedPosts(query, page, limit);
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
