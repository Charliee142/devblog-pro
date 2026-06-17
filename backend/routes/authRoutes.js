/**
 * Auth Routes
 *
 * TEACHING NOTE:
 * Routes map HTTP methods + URLs to controller functions.
 * We use express.Router() to create modular route handlers.
 */
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators/authValidator');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/changepassword', protect, changePassword);

module.exports = router;
