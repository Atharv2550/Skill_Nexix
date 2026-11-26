const express = require('express');
const {
  getUserProfile,
  updateProfile,
  getUserPosts,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/:id', protect, getUserProfile);
router.get('/:id/posts', protect, getUserPosts);

module.exports = router;

