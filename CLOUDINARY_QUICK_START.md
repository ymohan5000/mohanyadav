# Quick Start - Upload Photos & Videos to Cloudinary

## ✅ Already Configured
Your Cloudinary account is already connected:
- **Cloud Name:** deksobups
- **Credentials:** Set in environment

## 📸 How to Upload

### Step 1: Login as Admin
```
Go to: Your Site → Admin → Login
Email: admin@portfolio.com
Password: Admin@123
```

### Step 2: Go to Media Upload
```
Admin Dashboard → Media Upload
```

### Step 3: Upload Files
- **Option A:** Drag & drop files onto the page
- **Option B:** Click to browse and select files

### Step 4: View & Copy URLs
- Uploaded files appear below
- Click "Copy URL" button
- Use URLs in blogs, projects, profile

---

## 📋 Supported Files

### Images
- JPG, PNG, GIF, WebP

### Videos  
- MP4, MOV, AVI, WebM

**Max Size:** 100MB per file

---

## 🔗 Use Uploaded Media

### In Blog Posts
```
1. Upload image via Media Upload
2. Copy URL
3. Paste in blog editor
```

### In Projects
```
1. Upload project thumbnail
2. Copy URL
3. Paste in "Project Image" field
```

### In Profile
```
1. Upload profile picture
2. Copy URL
3. Update profile image
```

---

## 🌍 Cloudinary Dashboard

View all files and manage storage:
**https://cloudinary.com/console**

---

## ⚙️ Deployment Setup

### For Vercel Backend
The backend needs these environment variables:

Go to: **Vercel** → **Backend Project** → **Settings** → **Environment Variables**

Add:
```
CLOUDINARY_CLOUD_NAME = deksobups
CLOUDINARY_API_KEY = 158635121225972
CLOUDINARY_API_SECRET = Jys3H90hjSs8Nn0ofJVAonUYfNI
```

Then **Redeploy** the backend.

---

## ✅ Verify Setup Works

### Test Upload:
1. Go to `/admin/media`
2. Upload a test image
3. Check if URL appears
4. Click copy URL
5. Paste in browser - should see image

### Test Production:
1. Visit your deployed site
2. Go to admin area
3. Upload file
4. Verify URL works

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Login first with admin account |
| 400 Bad Request | Check file type is supported |
| 500 Server Error | Verify env vars in Vercel |
| URL not working | Check Cloudinary account status |

---

## 📚 Full Guide
See: **CLOUDINARY_SETUP_GUIDE.md** for detailed information

