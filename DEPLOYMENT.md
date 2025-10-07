# Deployment Guide

## Prerequisites

1. **GitHub Account**: To store your code
2. **Vercel Account**: For hosting (free tier available)
3. **Supabase Project**: Already set up with your database

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: Nepali Community Indiana app"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/nepali-community-indiana.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? N
# - What's your project's name? nepali-community-indiana
# - In which directory is your code located? ./
# - Want to override the settings? N
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Add Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://nzryqmfztbunvgxfslky.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
   ```

### 4. Redeploy

After adding environment variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Your app will be live at `https://your-project-name.vercel.app`

## Custom Domain (Optional)

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS settings as instructed
4. SSL certificate will be automatically provisioned

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Environment Variables**: Make sure they're set in Vercel dashboard
3. **Database Connection**: Verify Supabase URL and key are correct
4. **Map Not Loading**: Ensure Leaflet CSS is properly imported

### Logs:
- Check build logs in Vercel dashboard
- Use `vercel logs` command for runtime logs

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables configured
- [ ] Database schema applied in Supabase
- [ ] App loads without errors
- [ ] Registration form works
- [ ] Map displays correctly
- [ ] Location search functions properly

Your Nepali Community Indiana app is now live! 🎉