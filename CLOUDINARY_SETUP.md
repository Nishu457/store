# Cloudinary Setup Guide

Your website is now configured to use **Cloudinary** for cloud file storage! 

## Step-by-Step Setup:

### 1. Create Cloudinary Account (FREE)
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up with email
- Go to your **Dashboard**

### 2. Get Your Credentials
Copy these from your Cloudinary Dashboard:
- **Cloud Name**
- **API Key**
- **API Secret**

### 3. Update .env File
Open `d:\New folder\.env` and replace:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Example (with fake values):
```
CLOUDINARY_CLOUD_NAME=dxyzabc123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoP
```

### 4. Test It!
1. Run: `npm start`
2. Go to: `http://localhost:3000`
3. Login with:
   - Username: `nishunishanth883`
   - Password: `yojana`
4. Upload a file
5. File goes to **Cloudinary Cloud** (not local storage)
6. Download anytime ✅

## How It Works:

✅ **Upload** → File goes to Cloudinary Cloud (10MB limit)
✅ **View** → Dashboard shows all cloud files
✅ **Download** → Direct download from Cloudinary
✅ **Delete** → Removes from cloud storage
✅ **Persistent** → Files stay even after server restart!

## Benefits:

- 📁 Files saved in cloud (not local)
- 🔒 Secure storage
- 🌍 Works after deployment
- 📦 Free plan includes 25GB storage
- ⚡ Fast CDN delivery

## Deploying to Railway:

When you deploy, add these environment variables to Railway:
1. `CLOUDINARY_CLOUD_NAME`
2. `CLOUDINARY_API_KEY`
3. `CLOUDINARY_API_SECRET`

Your uploaded files will persist forever! 🎉
