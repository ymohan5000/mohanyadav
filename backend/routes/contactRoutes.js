const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markRead,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', sendMessage);
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, markRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
