const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addGalleryPhoto,
  removeGalleryPhoto,
} = require('../controllers/profileController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getProfile);
router.put('/', protect, adminOnly, updateProfile);
router.post('/gallery', protect, adminOnly, addGalleryPhoto);
router.delete('/gallery/:index', protect, adminOnly, removeGalleryPhoto);

module.exports = router;
