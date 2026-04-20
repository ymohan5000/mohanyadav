const Profile = require('../models/Profile');

// GET /api/profile — public
exports.getProfile = async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  res.json({ success: true, profile });
};

// PUT /api/profile — admin only
exports.updateProfile = async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create(req.body);
  } else {
    Object.assign(profile, req.body);
    await profile.save();
  }
  res.json({ success: true, profile });
};

// POST /api/profile/gallery — add photo to gallery
exports.addGalleryPhoto = async (req, res) => {
  const { url, caption } = req.body;
  if (!url) return res.status(400).json({ success: false, message: 'URL required' });
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  profile.gallery.push({ url, caption: caption || '' });
  await profile.save();
  res.json({ success: true, gallery: profile.gallery });
};

// DELETE /api/profile/gallery/:index — remove photo
exports.removeGalleryPhoto = async (req, res) => {
  const index = Number(req.params.index);
  let profile = await Profile.findOne();
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
  profile.gallery.splice(index, 1);
  await profile.save();
  res.json({ success: true, gallery: profile.gallery });
};
