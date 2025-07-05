# 🔑 Production Environment Variables Template

Copy these EXACT values to your Vercel dashboard:

## Variable 1: ADMIN_USERS
```
Name: ADMIN_USERS
Value: [{"username":"YOUR_USERNAME","passwordHash":"YOUR_BCRYPT_HASH"}]
```

## Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: YOUR_64_CHARACTER_JWT_SECRET
```

## To Generate Your Own Credentials:
1. Run: `npm run generate-custom-admin`
2. Enter your desired username and password
3. Copy the generated values to Vercel dashboard
4. Test with your custom credentials

## Security Notes:
- ⚠️ This template file is safe to commit
- ⚠️ Never commit files with actual credentials
- ⚠️ Keep your real credentials in Vercel dashboard only
- ⚠️ Use strong, unique passwords for production

## Quick Setup Commands:
```bash
# Generate your credentials
npm run generate-custom-admin

# Test locally (after updating vite.config.js)
npm run dev

# Test production deployment
npm run test-production https://your-app.vercel.app
```
