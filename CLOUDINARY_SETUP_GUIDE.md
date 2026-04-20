# Cloudinary Setup Guide - Photo & Video Storage

## Overview
Your MERN portfolio uses **Cloudinary** for cloud-based storage and delivery of images and videos. This guide explains how to use it.

## Current Setup Status
✅ Backend Configuration: Configured
✅ Frontend Upload Component: Configured  
✅ Multer Integration: Configured
✅ File Validation: Active

## Features
- ✅ Image upload (JPEG, PNG, GIF, WebP)
- ✅ Video upload (MP4, MOV, AVI, WebM)
- ✅ Automatic file transformation
- ✅ Secure URLs with CDN delivery
- ✅ Admin-only uploads
- ✅ Drag-and-drop interface

---

## Backend Configuration

### 1. Environment Variables
Your backend/.env should include:
```env
CLOUDINARY_CLOUD_NAME=deksobups
CLOUDINARY_API_KEY=158635121225972
CLOUDINARY_API_SECRET=Jys3H90hjSs8Nn0ofJVAonUYfNI
```

### 2. API Routes
**Single File Upload:**
```
POST /api/upload
```

**Multiple Files Upload:**
```
POST /api/upload/multiple
```

Both endpoints require:
- Authentication (JWT token)
- Admin role
- FormData with file(s)

### 3. Upload Response
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/.../image.jpg",
  "public_id": "portfolio/xyz123",
  "resource_type": "image"
}
```

For multiple uploads:
```json
{
  "success": true,
  "files": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "public_id": "portfolio/xyz123",
      "resource_type": "image"
    }
  ]
}
```

---

## Frontend - Using the MediaUpload Component

### MediaUpload Page (`/admin/media`)

**Features:**
1. ✅ Drag & drop files
2. ✅ Browse file picker
3. ✅ Real-time preview
4. ✅ Progress tracking
5. ✅ Copy URL to clipboard
6. ✅ View all uploaded files

**How to Use:**
1. Go to Admin → Media Upload
2. Drag files or click to browse
3. Select images/videos
4. Click "Upload All"
5. Copy URL and use in content

---

## Using Uploads in Your Content

### In Blog Posts
```javascript
// Create blog with image
const blog = {
  title: "My Blog Post",
  content: "Content here...",
  image: "https://res.cloudinary.com/.../image.jpg"
};
```

### In Projects
```javascript
// Project with thumbnail
const project = {
  title: "My Project",
  description: "...",
  image: "https://res.cloudinary.com/.../thumbnail.jpg",
  link: "https://example.com"
};
```

### In Profile
```javascript
// Update profile with image
const profile = {
  name: "John Doe",
  bio: "...",
  image: "https://res.cloudinary.com/.../profile.jpg"
};
```

---

## API Examples

### Using cURL

**Single File Upload:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"
```

**Multiple Files:**
```bash
curl -X POST http://localhost:5000/api/upload/multiple \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

### Using JavaScript/Fetch

```javascript
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  return data.url;
}
```

### Using Axios

```javascript
import axios from 'axios';

const uploadFile = (formData, token) => {
  return axios.post('/api/upload', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};
```

---

## File Size Limits

- **Images:** Up to 100MB
- **Videos:** Up to 100MB

---

## Supported File Types

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

### Videos
- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- WebM (.webm)
- MKV (.mkv)

---

## Cloudinary Dashboard

Visit [Cloudinary Dashboard](https://cloudinary.com/console) to:
- View all uploaded media
- Manage storage
- Monitor bandwidth usage
- Create transformation URLs
- Delete files

**Your Credentials:**
- Cloud Name: `deksobups`
- Email: (Associated with your Cloudinary account)

---

## URL Transformations

Cloudinary URLs support various transformations:

### Resize Image
```
https://res.cloudinary.com/{cloud_name}/image/upload/w_400,h_300,c_fill/v1.../image.jpg
```

### Quality Adjustment
```
https://res.cloudinary.com/{cloud_name}/image/upload/q_80/v1.../image.jpg
```

### Format Conversion
```
https://res.cloudinary.com/{cloud_name}/image/upload/f_webp/v1.../image.jpg
```

### Video Thumbnail
```
https://res.cloudinary.com/{cloud_name}/video/upload/fl_still,w_400/v1.../video.mp4
```

---

## Security Features

✅ **Authentication Required** - Only logged-in users can upload
✅ **Admin Only** - Only admins can upload files
✅ **File Validation** - Only allowed MIME types accepted
✅ **Secure URLs** - HTTPS by default
✅ **Public ID Tracking** - Easy management and deletion

---

## Troubleshooting

### Upload Returns 401
- Check JWT token is valid
- Verify you're logged in as admin
- Token might have expired

### Upload Returns 400
- Check file type is supported
- Verify file size < 100MB
- Ensure FormData format is correct

### Upload Returns 500
- Check Cloudinary credentials in `.env`
- Verify environment variables are set in Vercel
- Check Cloudinary account is active

### Images/Videos Not Displaying
- Verify URL is correct
- Check Cloudinary account status
- Test URL directly in browser
- Clear browser cache

---

## Environment Variables in Vercel

### Backend Project Settings

Go to: **Settings** → **Environment Variables**

Add for production:
```
CLOUDINARY_CLOUD_NAME=deksobups
CLOUDINARY_API_KEY=158635121225972
CLOUDINARY_API_SECRET=Jys3H90hjSs8Nn0ofJVAonUYfNI
```

Then redeploy: **Deployments** → **Redeploy**

---

## Best Practices

1. ✅ Always login before uploading
2. ✅ Check file size before upload
3. ✅ Use appropriate image sizes for different contexts
4. ✅ Optimize videos before upload
5. ✅ Keep original URLs for reference
6. ✅ Test URLs after upload
7. ✅ Use CDN URLs for better performance

---

## Need Help?

- [Cloudinary Docs](https://cloudinary.com/documentation)
- Check server logs: `npm run dev`
- Test endpoints with Postman
- Verify credentials in Cloudinary dashboard

