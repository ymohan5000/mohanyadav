const express = require('express');
const router = express.Router();
const { uploadFile, uploadMultiple } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/', protect, adminOnly, upload.single('file'), uploadFile);
router.post('/multiple', protect, adminOnly, upload.array('files', 10), uploadMultiple);

module.exports = router;
