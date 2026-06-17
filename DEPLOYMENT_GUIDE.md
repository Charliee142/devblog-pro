# DevBlog Pro — Deployment Guide

This guide walks you through deploying DevBlog Pro to production:
- **Database**: MongoDB Atlas (free tier)
- **Backend**: Render (free tier)
- **Frontend**: Vercel (free tier)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create an Account
1. Go to https://cloud.mongodb.com
2. Sign up for a free account
3. Choose the **Free Shared** cluster (M0 Sandbox)

### 1.2 Create a Cluster
1. Select your cloud provider (AWS recommended) and region
2. Click **Create Cluster** (takes 2–3 minutes)

### 1.3 Create a Database User
1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter a username (e.g., `devblogadmin`) and a strong password
5. Set role to **Atlas Admin**
6. Click **Add User**

### 1.4 Whitelist IP Address
1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   > Note: For production, restrict to your server's IP
4. Click **Confirm**

### 1.5 Get Connection String
1. Go to **Database** in the sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Node.js** driver, version **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials
7. Add your database name before `?`: `...mongodb.net/devblog?retryWrites...`

---

## Step 2: GitHub Repository Setup

### 2.1 Initialize Repository
```bash
cd devblog-pro
git init
git add .
git commit -m "Initial commit: DevBlog Pro full-stack application"
```

### 2.2 Create .gitignore Files

**Backend `.gitignore`**:
```
node_modules/
.env
uploads/*
!uploads/.gitkeep
*.log
```

**Frontend `.gitignore`**:
```
node_modules/
dist/
.env
```

**Root `.gitignore`**:
```
node_modules/
.DS_Store
*.env
```

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/yourusername/devblog-pro.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up (you can use GitHub login)

### 3.2 Create Web Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Select `devblog-pro` repository

### 3.3 Configure Service
- **Name**: `devblog-pro-api`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free

### 3.4 Set Environment Variables
In Render dashboard → Environment:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://devblogadmin:password@cluster0.xxxxx.mongodb.net/devblog?retryWrites=true&w=majority
JWT_SECRET=your_super_long_random_secret_key_at_least_32_chars
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://your-app.vercel.app
```

### 3.5 Deploy
Click **Create Web Service**. Render will build and deploy automatically.

Your API will be at: `https://devblog-pro-api.onrender.com`

### 3.6 Test Deployment
```bash
curl https://devblog-pro-api.onrender.com/api/health
# Should return: {"success":true,"message":"DevBlog Pro API is running!"}
```

### 3.7 Seed the Database (optional)
SSH into Render or run locally with production MONGO_URI:
```bash
cd backend
MONGO_URI=your_production_uri node utils/seeder.js
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 4.2 Import Project
1. Click **New Project**
2. Import `devblog-pro` from GitHub
3. **Framework Preset**: Vite
4. **Root Directory**: `frontend`

### 4.3 Set Environment Variables
```
VITE_API_URL=https://devblog-pro-api.onrender.com/api
```

### 4.4 Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4.5 Deploy
Click **Deploy**. Vercel will build and deploy.

Your app will be at: `https://devblog-pro.vercel.app`

---

## Step 5: Update CORS on Backend

After deploying the frontend, update the `CLIENT_URL` environment variable on Render:
```
CLIENT_URL=https://your-actual-vercel-url.vercel.app
```

Then trigger a new deploy on Render.

---

## Step 6: Gmail App Password Setup (for email)

1. Go to your Google Account → Security
2. Enable **2-Step Verification** (required)
3. Go to **App passwords**
4. Select **Mail** and **Other device** (type "DevBlog Pro")
5. Copy the 16-character password
6. Use this as `EMAIL_PASS` in your environment variables

---

## Step 7: Custom Domain (Optional)

### Vercel Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `devblogpro.com`)
3. Update DNS records at your registrar:
   - Type: `A`, Name: `@`, Value: `76.76.21.21`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`

### Render Custom Domain
1. In Render dashboard → Settings → Custom Domains
2. Add your API subdomain (e.g., `api.devblogpro.com`)
3. Update DNS: `CNAME api → your-service.onrender.com`

---

## Troubleshooting

### Backend not starting on Render
- Check **Logs** in the Render dashboard
- Ensure all environment variables are set
- Verify `package.json` has `"start": "node server.js"`

### Frontend can't reach API
- Check `VITE_API_URL` is set correctly
- Verify CORS `CLIENT_URL` matches your Vercel URL exactly (no trailing slash)
- Check browser Network tab for CORS errors

### MongoDB connection fails
- Verify IP whitelist includes `0.0.0.0/0` or Render's IP
- Check MONGO_URI has correct username/password
- Confirm database name in the URI

### Images not loading after deploy
- Note: Multer saves to local disk. On Render, local files are ephemeral
- **For production**: Upgrade to Cloudinary (see below)

### Upgrade to Cloudinary (Production Image Storage)

Install: `npm install cloudinary multer-storage-cloudinary`

```javascript
// middleware/upload.js (production version)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'devblog-pro', allowed_formats: ['jpg', 'png', 'webp'] },
});
```

Add to Render env vars:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string obtained
- [ ] GitHub repository created and code pushed
- [ ] Render web service created
- [ ] All backend environment variables set on Render
- [ ] Backend deployed and health check passes
- [ ] Vercel project created
- [ ] `VITE_API_URL` set on Vercel
- [ ] Frontend deployed and accessible
- [ ] `CLIENT_URL` updated on Render with Vercel URL
- [ ] Test registration, login, create post, upload image
- [ ] (Optional) Custom domain configured
- [ ] (Optional) Cloudinary set up for persistent image storage
