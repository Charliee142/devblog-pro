/**
 * Authentication Controller
 *
 * TEACHING NOTE:
 * Controllers contain the business logic for handling requests.
 * They interact with models (database) and send responses.
 *
 * Pattern: Request → Route → Controller → Model → Response
 */

const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ========================
// HELPER: Send token response
// ========================

/**
 * This helper creates the JWT and sends it in the response.
 * We reuse this in register and login to avoid code duplication (DRY principle).
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// ========================
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// ========================
const register = async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? 'Email is already registered'
            : 'Username is already taken',
      });
    }

    // Create user — password is hashed in the pre-save hook
    const user = await User.create({
      fullName,
      username,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ========================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate that email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    /**
     * TEACHING NOTE: Why select('+password')?
     * In our User model, password has `select: false`
     * This means it's excluded from ALL queries by default.
     * To include it specifically, we use .select('+password')
     */
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // SECURITY: Don't tell them whether email or password is wrong
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare provided password with hashed password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ========================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgotpassword
// @access  Public
// ========================
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // SECURITY: Don't reveal if email exists in database
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your DevBlog Pro account.</p>
      <p>Click the link below to reset your password (valid for 10 minutes):</p>
      <a href="${resetUrl}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
        Reset Password
      </a>
      <p>If you didn't request this, ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'DevBlog Pro - Password Reset',
        html: message,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent.',
      });
    } catch (emailError) {
      // If email fails, clear the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
// ========================
const resetPassword = async (req, res, next) => {
  try {
    // Hash the URL token to compare with stored hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ========================
// @desc    Change password (when logged in)
// @route   PUT /api/auth/changepassword
// @access  Private
// ========================
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
};
