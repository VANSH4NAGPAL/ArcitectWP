# 🚀 Vercel Deployment Steps

## Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up" or "Log in"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

## Step 2: Import Your Project
1. In Vercel dashboard, click "Add New..."
2. Select "Project"
3. Find your repository "ArchitectWP" (or similar name)
4. Click "Import"

## Step 3: Configure Project Settings
1. **Project Name**: Keep default or change to your preference
2. **Framework Preset**: Should auto-detect as "Vite"
3. **Root Directory**: Leave as "./" (default)
4. **Build Command**: `npm run build` (should be auto-detected)
5. **Output Directory**: `dist` (should be auto-detected)
6. **Install Command**: `npm install` (should be auto-detected)

## Step 4: Add Environment Variables
Before clicking "Deploy", add these environment variables:

### Required Variables:
```
ADMIN_USERS
[{"username":"admin","passwordHash":"$2a$12$pq1PXHjpfeyEpctlYp3aHeFAAGlAt9j2i5q5XsPrHYdEbO825xv9u"},{"username":"superadmin","passwordHash":"$2a$12$k9t2/EZgZ5k1end25ul3Nu9.MNYrdHon/1iPEaRL7RFeDzlJ9xiqu"}]

JWT_SECRET
cb4550f073d0b2ae1f5a25f8818b06a4fc5695c9426d2621081ddb3353c573fa8f5394c69ae9c6fa788c47f5683838eefaefc5fbe5039c561df5e0b5cbb5654c5d
```

### To Add Variables:
1. Click "Environment Variables" section
2. For each variable:
   - Name: `ADMIN_USERS`
   - Value: `[{"username":"admin",...}]` (the full JSON string)
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Add"
3. Repeat for `JWT_SECRET`

## Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 1-2 minutes)
3. You'll get a live URL like: `https://your-project-name.vercel.app`

## Step 6: Test Your Deployment
1. Visit your live URL
2. Try logging in with:
   - Username: `admin`, Password: `admin123!@#`
   - Username: `superadmin`, Password: `super456$%^`
3. Test the show/hide password toggle
4. Verify all admin features work

## Step 7: Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Step 8: Post-Deployment Security
1. **Change default passwords immediately**
2. **Rotate JWT secret if needed**
3. **Test all security features**
4. **Monitor deployment logs**

## Troubleshooting
- If deployment fails, check the build logs in Vercel
- Make sure all environment variables are set correctly
- Verify that your GitHub repository has the latest code
- Check that API endpoints are accessible

## Next Steps
1. Test all functionality on your live site
2. Update DNS if using custom domain
3. Monitor security logs
4. Set up automated backups
5. Plan for regular security updates

---
**Your deployment should now be live! 🎉**
