# Multi-Admin Authentication Setup

This project now supports both single-admin and multi-admin authentication modes with enhanced security features.

## Features Added

### 🔐 Enhanced Login UI
- **Username + Password fields** (instead of password-only)
- **Show/Hide password toggle** with eye icon
- **Improved validation** for both username and password
- **Better error messages** for failed authentication

### 👥 Multi-Admin Support
- **Multiple admin accounts** with different usernames and passwords
- **Backward compatibility** with single-admin password-only mode
- **Secure password hashing** using bcrypt with salt rounds
- **Individual user tracking** in audit logs

## Quick Start

### For Development (Local Testing)

1. **Test the legacy mode (password-only):**
   - Leave username empty
   - Password: `@admin!1234`

2. **Test multi-admin mode:**
   - Username: `admin` | Password: `admin123!@#`
   - Username: `superadmin` | Password: `super456$%^`

### For Production Setup

1. **Generate admin users:**
   ```bash
   npm run generate-admin-users
   ```

2. **Copy the generated environment variables to your production environment (Vercel dashboard)**

3. **Update local development config if needed** (see vite.config.js)

## Configuration Modes

### Multi-Admin Mode (Recommended)

Set the `ADMIN_USERS` environment variable:
```bash
ADMIN_USERS='[{"username": "admin", "passwordHash": "$2a$12$..."}, {"username": "superadmin", "passwordHash": "$2a$12$..."}]'
```

### Single Admin Mode (Backward Compatibility)

Set the legacy environment variable:
```bash
ADMIN_PASSWORD_HASH=$2a$12$your-bcrypt-hash-here
```

## Local Development

The local development server (vite.config.js) has hardcoded admin users for testing:

```javascript
const adminUsers = [
  {
    username: 'admin',
    passwordHash: '$2a$12$ygrQG8A6wH9XO.MpR/Vw2uft5Lbj8oeXArCOE7aTUdvdrW0Ta9G1q' // admin123!@#
  },
  {
    username: 'superadmin', 
    passwordHash: '$2a$12$TYrCHOzXN/b2Kxo.0XtTS.TPt.TvknS0moQjx8bC66f1V06NhAHkAm' // super456$%^
  }
];

// Legacy password hash for backward compatibility
const legacyHash = '$2a$12$LplY7HMm9vW8ZVD8pl6/IePbasEhRecG91H07gCV6RpJCJKRbw/lG'; // @admin!1234
```

## Migration from Old System

The new system is **100% backward compatible**:

- If you have `ADMIN_PASSWORD_HASH` set, it works as before
- If you set `ADMIN_USERS`, it enables multi-admin mode
- The frontend automatically adapts to both modes
- Existing sessions remain valid during the transition

## Security Improvements

1. **Username + Password**: More secure than password-only
2. **Show/Hide Password**: Better UX without compromising security
3. **Individual Admin Tracking**: Know which admin performed what action
4. **Stronger Password Policies**: Encourage unique passwords per admin
5. **Audit Trail**: Better logging with username information

## Testing

Visit `http://localhost:5173` and test:

1. **Show/Hide Password Toggle**: Click the eye icon
2. **Multi-Admin Login**: Try different username/password combinations
3. **Failed Login**: Test with wrong credentials
4. **Brute Force Protection**: Try 3+ failed attempts

## Production Deployment

1. Run `npm run generate-admin-users`
2. Copy the `ADMIN_USERS` environment variable to Vercel
3. Set the `JWT_SECRET` in Vercel
4. Deploy with `npm run deploy-prod`
5. Test login on your production domain

## Environment Variables

### Required (Multi-Admin Mode)
- `ADMIN_USERS`: JSON array of admin users with hashed passwords
- `JWT_SECRET`: 64-character random string for JWT signing

### Required (Single Admin Mode)  
- `ADMIN_PASSWORD_HASH`: bcrypt hash of the admin password
- `JWT_SECRET`: 64-character random string for JWT signing

### Optional
- `REDIS_URL`: For distributed rate limiting
- `FIREBASE_PROJECT_ID`: For persistent audit logging
- `AUDIT_WEBHOOK_URL`: For external notifications

## File Changes Made

### Frontend
- `src/components/AdminAuthWrapper.jsx`: Added username field and show/hide password
- Updated authentication flow to support both modes

### Backend
- `api/headinfo/auth-login.js`: Multi-admin support with username validation
- `api/headinfo/verify-token.js`: Include username in token verification
- `vite.config.js`: Local development server with multi-admin testing

### Utilities
- `generate-admin-users.js`: Password hash generator for multiple admins
- `package.json`: Added `generate-admin-users` script

### Documentation  
- `DEPLOYMENT_GUIDE.md`: Updated with multi-admin instructions
- `README_MULTI_ADMIN.md`: This comprehensive guide

## Need Help?

1. **Generate new admin users**: `npm run generate-admin-users`
2. **Test locally**: `npm run dev` and visit `http://localhost:5173`
3. **Check the deployment guide**: See `DEPLOYMENT_GUIDE.md`
4. **Security testing**: `npm run test-security`

---

**Note**: Remember to change the default passwords in production and use strong, unique passwords for each admin account!
