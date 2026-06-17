/**
 * File Upload Middleware (Multer)
 *
 * TEACHING NOTE:
 * Multer is middleware for handling multipart/form-data (file uploads).
 * It processes uploaded files and makes them available in req.file or req.files.
 *
 * Storage options:
 * - diskStorage: Save files to disk (used here)
 * - memoryStorage: Keep files in memory (useful for cloud uploads)
 */

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(error, destination folder)
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename to prevent collisions
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

// File filter — only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter,
});

module.exports = upload;
