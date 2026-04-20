const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Login admin
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
};

// @desc    Register admin (first-time setup)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const count = await User.countDocuments();
  if (count > 0) {
    return res.status(403).json({ success: false, message: 'Admin already exists' });
  }

  const user = await User.create({ name, email, password, role: 'admin' });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
