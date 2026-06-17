/**
 * Authentication Middleware
 *
 * TEACHING NOTE:
 * Middleware is code that runs BETWEEN the request and the route handler.
 * Think of it as a bouncer at a club — it checks your "ID" (token) before
 * letting you into the protected route.
 *
 * Flow:
 * Client Request → auth middleware → (if valid) → Route Handler → Response
 *                                 → (if invalid) → 401 Unauthorized
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Verify JWT token and attach user to request
 *
 * TEACHING NOTE: HOW JWT AUTH WORKS
 * 1. User logs in → server creates JWT token with user's ID
 * 2. Client stores token (localStorage or httpOnly cookie)
 * 3. Client sends token in every request: Authorization: Bearer <token>
 * 4. Server verifies token signature using JWT_SECRET
 * 5. If valid: attach user to req.user and proceed
 * 6. If invalid/expired: return 401 Unauthorized
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // Also check cookies (for cookie-based auth)
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    // Verify the token using our secret key
    // If tampered with or expired, this throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the decoded token ID
    // We use select('+password') to exclude password
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    // Attach user to request object — available in all subsequent middleware/routes
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized.',
    });
  }
};

/**
 * authorize - Check if user has required role(s)
 *
 * TEACHING NOTE: Authentication vs Authorization
 * Authentication: "Who are you?" (verify identity via JWT)
 * Authorization: "What can you do?" (check permissions/roles)
 *
 * Usage: router.delete('/users/:id', protect, authorize('admin'), deleteUser)
 * This means: must be logged in AND must be an admin
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

/**
 * optionalAuth - Attach user if token provided, but don't require it
 * Useful for routes that behave differently for logged-in users
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(); // No token, continue without user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (error) {
    // Invalid token, continue without user
  }

  next();
};

module.exports = { protect, authorize, optionalAuth };
