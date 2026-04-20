const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = /image\/(jpeg|jpg|png|gif|webp|svg\+xml)|video\/(mp4|quicktime|avi|webm|x-matroska)/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('File type not supported'), false);
  },
});

// Upload buffer to Cloudinary and return url + public_id
const uploadToCloudinary = (buffer, mimetype, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const isVideo = mimetype.startsWith('video/');
    const options = {
      folder,
      resource_type: isVideo ? 'video' : 'image',
    };
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
    
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(error);
    });
    
    stream.end(buffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
