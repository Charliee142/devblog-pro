const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllPosts,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication AND admin role
router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/posts', getAllPosts);

module.exports = router;
