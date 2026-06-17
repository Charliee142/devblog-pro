/**
 * DevBlog Pro - Server Entry Point
 *
 * TEACHING NOTE:
 * This is where our Express application boots up.
 * Think of this as the "ignition key" of our backend.
 * It connects to the database and starts listening for HTTP requests.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// ========================
// SECURITY MIDDLEWARE
// ========================

/**
 * WHY HELMET?
 * Helmet sets various HTTP headers to protect against common web vulnerabilities.
 * Example: It prevents clickjacking by setting X-Frame-Options header.
 */
app.use(helmet());

/**
 * WHY CORS?
 * CORS (Cross-Origin Resource Sharing) controls which domains can access our API.
 * Without CORS config, browsers block requests from our React frontend to our API.
 */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * WHY RATE LIMITING?
 * Prevents brute-force attacks. If someone tries 1000 login attempts per minute,
 * rate limiting blocks them after a threshold.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs per IP
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ========================
// BODY PARSING MIDDLEWARE
// ========================
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * WHY MONGO SANITIZE?
 * Prevents NoSQL injection attacks.
 * Example attack: { "email": { "$gt": "" } } would match ALL users.
 * Sanitize strips $ and . from keys.
 */
app.use(mongoSanitize());

// ========================
// LOGGING MIDDLEWARE
// ========================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ========================
// STATIC FILES
// ========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// API ROUTES
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DevBlog Pro API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ========================
// ERROR HANDLING
// ========================
app.use(notFound);
app.use(errorHandler);

// ========================
// DATABASE CONNECTION
// ========================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 DevBlog Pro API Server`);
    console.log(`📡 Running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

module.exports = app; // Export for testing
