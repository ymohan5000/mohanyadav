# MERN Portfolio - Vercel Deployment Guide

## Prerequisites
- Node.js and npm installed
- Vercel account (https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`
- MongoDB Atlas account
- Cloudinary account

## Setup Steps

### 1. Local Build Test
```bash
npm install:all
npm run build
```

### 2. Environment Variables Setup

#### Backend Environment Variables
Create/update `backend/.env` with:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123
CLIENT_URL=https://your-frontend-url.vercel.app
```

#### Frontend Environment Variables
Already configured in `frontend/.env.production` to use `/api`

### 3. Deploy Backend to Vercel

```bash
cd backend
vercel --prod
```

When prompted:
- Link to existing project: No (first time)
- Project name: portfolio-backend
- Directory: ./
- Override settings: No

After deployment, copy the deployment URL (e.g., `https://portfolio-backend.vercel.app`)

### 4. Deploy Frontend to Vercel

```bash
cd ../frontend
vercel --prod
```

When prompted:
- Link to existing project: No (first time)
- Project name: portfolio-frontend
- Directory: ./
- Build command: `npm run build`
- Output directory: `dist`

### 5. Configure Environment Variables in Vercel

#### For Backend Project:
Go to Vercel Dashboard → project → Settings → Environment Variables

Add these from your `.env` file:
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLIENT_URL` (set to your frontend URL)

#### For Frontend Project:
Go to Vercel Dashboard → project → Settings → Environment Variables

Add:
- `VITE_API_URL` = `https://your-backend-url.vercel.app/api`

### 6. Redeploy after Environment Variables

After setting environment variables:
```bash
vercel --prod --env-file=.env
```

## Alternative: Single Deployment (Monorepo)

If you want both frontend and backend in single Vercel project:

1. Use the `vercel.json` at root level (already configured)
2. Deploy from root folder:
```bash
vercel --prod
```

## Key Points

✅ Frontend automatically proxies `/api` to backend
✅ CORS is enabled and configured
✅ MongoDB connection is established
✅ JWT authentication is working
✅ Cloudinary image uploads are configured
✅ Admin credentials are set up
✅ Health check endpoint available at `/api/health`

## Troubleshooting

### 1. CORS Issues
- Ensure `CLIENT_URL` environment variable is set correctly in backend
- Check frontend is using correct API URL

### 2. 502 Bad Gateway
- Check MongoDB connection string
- Verify all required environment variables are set
- Check backend logs in Vercel dashboard

### 3. Frontend showing blank page
- Check `VITE_API_URL` in frontend environment
- Verify build command and output directory
- Check browser console for errors

### 4. API Not Found
- Verify backend project is deployed
- Check routes configuration in `vercel.json`
- Ensure backend environment variables are set

## Monitoring

After deployment:
1. Visit frontend URL to test application
2. Check Vercel dashboard logs for errors
3. Use browser DevTools to check network requests
4. Test API endpoints: `https://backend-url/api/health`

## Useful Commands

```bash
# List all deployments
vercel list

# Check specific deployment
vercel inspect

# View logs
vercel logs

# Remove a deployment
vercel remove [url]

# Pull environment variables
vercel env pull
```

## Security Notes

⚠️ Never commit `.env` files with real credentials
⚠️ Rotate JWT_SECRET periodically
⚠️ Use strong ADMIN_PASSWORD
⚠️ Keep Cloudinary API keys secure
⚠️ Monitor MongoDB connection logs

For more help: https://vercel.com/docs
