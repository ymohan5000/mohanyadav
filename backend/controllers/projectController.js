const Project = require('../models/Project');

// @route GET /api/projects
exports.getProjects = async (req, res) => {
  const { featured, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (featured === 'true') query.featured = true;
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { techStack: { $in: [new RegExp(search, 'i')] } },
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Project.countDocuments(query);
  const projects = await Project.find(query)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), projects });
};

// @route GET /api/projects/:id
exports.getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, project });
};

// @route POST /api/projects
exports.createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, project });
};

// @route PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, project });
};

// @route DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
};
