const Blog = require('../models/Blog');

// @route GET /api/blogs
exports.getBlogs = async (req, res) => {
  const { search, tag, page = 1, limit = 10, published } = req.query;
  const query = {};

  if (published !== undefined) query.published = published === 'true';
  else query.published = true; // public only shows published

  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ];
  if (tag) query.tags = { $in: [tag] };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .select('-content');

  res.json({ success: true, total, page: Number(page), blogs });
};

// @route GET /api/blogs/admin (all blogs including unpublished)
exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).select('-content');
  res.json({ success: true, blogs });
};

// @route GET /api/blogs/:id
exports.getBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, blog });
};

// @route POST /api/blogs
exports.createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, blog });
};

// @route PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, blog });
};

// @route DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, message: 'Blog deleted' });
};
