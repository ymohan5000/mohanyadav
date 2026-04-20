const express = require('express');
const router = express.Router();
const { getSignature } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/sign', protect, adminOnly, getSignature);

module.exports = router;
