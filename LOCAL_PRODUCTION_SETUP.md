# ArchitectWP - Local & Production Setup Guide

## 🎯 Overview
Your ArchitectWP admin panel now works seamlessly in both local development and production environments with robust security features.

## 🔧 Local Development Setup

### 1. Environment Variables
The `.env.local` file is already configured with:
- `VITE_ADMIN_PASSWORD_HASH` - Hash for password `@admin!1234`
- `VITE_JWT_SECRET` - JWT signing secret for local development
- Standard variables for production compatibility

### 2. Start Development Server
```bash
npm run dev
```

The development server will:
- ✅ Run on `http://localhost:5173`
- ✅ Mock all headinfo API endpoints locally
- ✅ Use bcrypt password verification
- ✅ Generate JWT tokens for session management
- ✅ Log audit events to console
- ✅ Bypass rate limiting for development

### 3. Headinfo Access
- Navigate to: `http://localhost:5173/headinfo`
- Password: `@admin!1234`
- All headinfo features work locally without Vercel CLI

## 🚀 Production Deployment

### 1. Vercel Environment Variables
Set these in your Vercel dashboard:
```
ADMIN_PASSWORD_HASH=$2a$12$LplY7HMm9vW8ZVD8pl6/IePbasEhRecG91H07gCV6RpJCJKRbw/lG
JWT_SECRET=369d93f8bb3c8d5e1165067cfbfe32ec8bbb5642495c28886d084d0609447a3752636ae4c60048cd3ceaf37e5d0f5b8b2ad4d42e38610efeccd94c2f17d76ac2
```

### 2. Deploy to Production
```bash
npm run build
vercel --prod
```

## 🔐 Security Features

### ✅ Implemented
- **Server-side Authentication**: bcrypt + JWT
- **Brute Force Protection**: Rate limiting with exponential backoff
- **Session Management**: 2-hour token expiry with refresh
- **Audit Logging**: All admin actions logged
- **HTTPS Enforcement**: Automatic redirect to HTTPS
- **Security Headers**: CSP, HSTS, XSS protection
- **Input Validation**: Sanitized user inputs
- **Environment Separation**: Different configs for dev/prod

### 🛡️ Security Headers (Production)
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 📁 File Structure

### Local Development API Handler
- `vite.config.js` - Contains local API mocking for all headinfo endpoints

### Production API Endpoints
- `/api/headinfo/auth-login.js` - Authentication endpoint
- `/api/headinfo/verify-token.js` - Token verification
- `/api/headinfo/store-audit.js` - Audit logging
- `/api/headinfo/rate-limit.js` - Brute force protection

### Security Components
- `src/components/AdminAuthWrapper.jsx` - Client auth logic
- `src/components/HttpsEnforcement.jsx` - HTTPS redirect
- `src/utils/auditLogger.js` - Audit utility

## 🧪 Testing

### Local Development
1. Start server: `npm run dev`
2. Navigate to: `http://localhost:5173/headinfo`
3. Login with: `@admin!1234`
4. Check console for audit logs

### Production
1. Deploy to Vercel
2. Navigate to: `https://your-domain.vercel.app/headinfo`
3. Login with: `@admin!1234`
4. Verify HTTPS redirect and security headers

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid password" in local development
- Check `.env.local` has correct `VITE_ADMIN_PASSWORD_HASH`
- Verify password is exactly `@admin!1234`
- Restart dev server after env changes

#### 2. "Module not found" errors
- Run `npm install` to ensure bcryptjs and jsonwebtoken are installed
- Check that Node.js version is compatible

#### 3. CORS errors in local development
- The Vite config handles CORS automatically
- Ensure you're accessing `http://localhost:5173`, not a different port

#### 4. Production authentication fails
- Verify Vercel environment variables are set correctly
- Check Vercel function logs for errors
- Ensure environment variables don't have extra spaces

## 🔄 Environment Variable Management

### Local Development (`.env.local`)
```bash
# Used by Vite dev server
VITE_ADMIN_PASSWORD_HASH=$2a$12$...
VITE_JWT_SECRET=...
```

### Production (Vercel Dashboard)
```bash
# Used by serverless functions
ADMIN_PASSWORD_HASH=$2a$12$...
JWT_SECRET=...
```

## 📊 Monitoring

### Audit Logs
- **Local**: Console output with emoji indicators
- **Production**: Stored server-side (can be extended to external services)

### Security Events Logged
- Login attempts (success/failure)
- Admin actions (add/edit/delete projects)
- Rate limiting triggers
- Token validation failures

## 🎯 Next Steps

1. **Test locally**: Verify all admin functions work with `npm run dev`
2. **Deploy to Vercel**: Update environment variables and deploy
3. **Security review**: Test brute force protection and audit logging
4. **Monitor**: Check audit logs for any suspicious activity

---

**🔒 Your headinfo panel is now production-ready with enterprise-grade security!**
