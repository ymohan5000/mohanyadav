const { uploadToCloudinary } = require('../config/cloudinary');

// @route POST /api/upload
exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
};

// @route POST /api/upload/multiple
exports.uploadMultiple = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  try {
    const files = await Promise.all(
      req.files.map(async (f) => {
        const result = await uploadToCloudinary(f.buffer, f.mimetype);
        return {
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        };
      })
    );
    res.json({ success: true, files });
  } catch (err) {
    console.error('Multiple upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
};
