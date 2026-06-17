const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts,
  getFeaturedPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/my-posts', protect, getMyPosts);
router.get('/:slug', getPost);
router.post('/', protect, upload.single('featuredImage'), createPost);
router.put('/:id', protect, upload.single('featuredImage'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
