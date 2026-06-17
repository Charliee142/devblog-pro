const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, getDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/dashboard', protect, getDashboard);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/:username', getUserProfile);

module.exports = router;
