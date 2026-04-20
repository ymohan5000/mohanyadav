const { cloudinary } = require('../config/cloudinary');

// @route POST /api/upload/sign
// Returns a Cloudinary signature so the frontend can upload directly
exports.getSignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'portfolio';
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({
    success: true,
    timestamp,
    signature,
    folder,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
};
