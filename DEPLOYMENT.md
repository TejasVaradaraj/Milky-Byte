# Deployment Guide - Toyota Galaxy Website

## Overview
Your website consists of two parts:
1. **Frontend** (React/Vite) - Already deployed to Vercel ✅
2. **Backend** (FastAPI) - Needs to be deployed separately ⚠️

## Quick Fix for Your Current Issue

The Search Vehicles feature isn't working because the backend isn't accessible from your deployed Vercel site. Here's how to fix it:

---

## Option 1: Deploy Backend to Render (Recommended - Free Tier Available)

### Step 1: Create `requirements.txt` in backend folder

Create this file: `Milky-Byte/backend/requirements.txt`
```txt
fastapi
uvicorn[standard]
pandas
requests
python-multipart
```

### Step 2: Deploy to Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `toyota-galaxy-api` (or any name)
   - **Root Directory**: `Milky-Byte/backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://toyota-galaxy-api.onrender.com`)

### Step 3: Update Vercel Environment Variable

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://toyota-galaxy-api.onrender.com` (your Render URL)
4. Click "Save"
5. Go to **Deployments** and click "Redeploy" on the latest deployment

---

## Option 2: Deploy Backend to Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the Python app
5. Add these environment variables in Railway:
   - Nothing needed for basic setup
6. Copy the generated URL
7. Update `VITE_API_URL` in Vercel (same as Option 1, Step 3)

---

## Option 3: Deploy Backend to Python Anywhere

1. Go to https://www.pythonanywhere.com
2. Create a free account
3. Upload your backend files
4. Configure WSGI file for FastAPI
5. Get your URL and update Vercel

---

## Verifying Everything Works

After deploying the backend and setting the environment variable:

1. Visit your Vercel site
2. Go to the Home page
3. Scroll to "Find Your Perfect Toyota" 
4. Click "Search Vehicles"
5. You should see Toyota vehicles loaded from the backend!

---

## Important Files Modified

✅ `src/config.ts` - Centralized API configuration
✅ `src/components/SearchSection.tsx` - Updated to use config
✅ `src/components/LoanCalculator.tsx` - Updated to use config
✅ `src/components/LeaseCalculator.tsx` - Updated to use config
✅ `src/components/ComparePage.tsx` - Updated to use config

---

## Troubleshooting

### Issue: "Search Vehicles" still not working
- Make sure backend is deployed and running
- Check backend URL is correct in Vercel environment variables
- Make sure `VITE_API_URL` doesn't have trailing slash
- Redeploy Vercel after adding environment variable

### Issue: CORS errors
- Check that backend CORS settings include your Vercel domain
- Update `main.py` origins to include your Vercel URL

### Issue: Backend crashes on Render
- Make sure `requirements.txt` is in the correct folder
- Check Render logs for errors
- Ensure `cars_priced.csv` is in the backend folder

---

## Backend CORS Update Needed

Add your Vercel URL to the backend CORS origins in `main.py`:

```python
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "https://your-vercel-app.vercel.app",  # ADD THIS
    "https://*.vercel.app",  # ADD THIS for all preview deployments
]
```

---

## Cost Summary

- **Vercel (Frontend)**: Free ✅
- **Render (Backend)**: Free tier available (750 hours/month)
- **Railway (Backend)**: $5/month after free trial
- **Python Anywhere (Backend)**: Free tier available (limited)

**Recommendation**: Start with Render's free tier

