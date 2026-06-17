/**
 * User Model
 *
 * TEACHING NOTE:
 * A Mongoose Model is a class that lets us interact with a MongoDB collection.
 * The Schema defines the shape of documents in our collection.
 * Think of it like a blueprint for every user document.
 *
 * KEY CONCEPTS:
 * - Schema: Defines fields, types, validation rules
 * - Model: Creates a collection and provides methods (find, save, etc.)
 * - Virtuals: Computed fields not stored in DB
 * - Middleware (hooks): Code that runs before/after operations
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // IMPORTANT: Never return password in queries by default
    },
    profilePicture: {
      type: String,
      default: 'default-avatar.png',
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ========================
// VIRTUAL FIELDS
// ========================

/**
 * TEACHING NOTE: Virtuals
 * Virtual fields are computed values not stored in the database.
 * Here we create a 'postCount' virtual that counts a user's posts.
 * The populate is needed to use this.
 */
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
});

// ========================
// MIDDLEWARE (HOOKS)
// ========================

/**
 * TEACHING NOTE: Pre-save Hook
 * This runs BEFORE a user document is saved to the database.
 *
 * WHY HASH PASSWORDS?
 * We NEVER store plain text passwords. If the database is breached,
 * hashed passwords are useless to attackers without cracking them.
 *
 * WHY bcrypt?
 * bcrypt uses "salting" (adding random data) and is intentionally slow,
 * making brute-force attacks computationally expensive.
 *
 * WHY salt rounds = 12?
 * Each additional round doubles the time to hash. 12 rounds = ~300ms.
 * Fast enough for users, slow enough for attackers.
 */
UserSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ========================
// INSTANCE METHODS
// ========================

/**
 * TEACHING NOTE: Instance Methods
 * These methods are available on each document instance (individual user).
 */

// Compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  /**
   * TEACHING NOTE: JWT Structure
   * A JWT has 3 parts: header.payload.signature
   * - Header: Algorithm type (HS256)
   * - Payload: Data (user id, role) - NOT sensitive data!
   * - Signature: Verifies the token wasn't tampered with
   *
   * jwt.sign(payload, secret, options)
   */
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and save to database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Return the unhashed token (sent to user via email)
  return resetToken;
};

// ========================
// STATIC METHODS
// ========================

/**
 * TEACHING NOTE: Static Methods
 * Static methods are called on the Model itself, not instances.
 * Example: User.findByEmail(email) vs user.matchPassword(pass)
 */
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
