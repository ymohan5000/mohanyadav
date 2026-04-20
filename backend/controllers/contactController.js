const Message = require('../models/Message');

// @route POST /api/contact
exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message required' });
  }
  const msg = await Message.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: 'Message sent successfully', data: msg });
};

// @route GET /api/contact (admin only)
exports.getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, messages });
};

// @route PUT /api/contact/:id/read
exports.markRead = async (req, res) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
  res.json({ success: true, message: msg });
};

// @route DELETE /api/contact/:id
exports.deleteMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Message deleted' });
};
