# 🔐 Admin Credentials Management Guide

This guide shows you how to track and manage all admin users on your website.

## 📋 **Current Admin Users**

Run this command to see all current admin users:
```bash
npm run track-admins
```

This will show you:
- All active admin users
- Their usernames and passwords
- When they were created
- Ready-to-copy Vercel configuration

## 🆕 **Adding New Admin Users**

### Method 1: Using the Admin Tracker
```bash
node track-admins.js add <username> <password>
```

Example:
```bash
node track-admins.js add newadmin SecurePass123!
```

### Method 2: Using Custom Generator
```bash
npm run generate-custom-admin
```

## 🧪 **Testing Admin Credentials**

Test if credentials work:
```bash
node track-admins.js test <username> <password>
```

Example:
```bash
node track-admins.js test sadmin "@@private!lgn"
```

## 🔄 **Updating Production (Vercel)**

When you add new admins:

### 1. Get Current Configuration
```bash
npm run track-admins
```

### 2. Copy the ADMIN_USERS value to Vercel
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Update the `ADMIN_USERS` variable with the new JSON array
- Save and redeploy

### 3. Update Local Development (Optional)
Update `vite.config.js` with new admin users for local testing.

## 🗂️ **Admin Management Commands**

| Command | Description | Example |
|---------|-------------|---------|
| `npm run track-admins` | Show all current admins | `npm run track-admins` |
| `track-admins list` | Same as above | `node track-admins.js list` |
| `track-admins add` | Add new admin | `node track-admins.js add user123 pass456` |
| `track-admins test` | Test credentials | `node track-admins.js test user123 pass456` |
| `track-admins help` | Show help | `node track-admins.js help` |

## 👥 **Current Active Admins**

As of your last setup:

1. **Primary Admin:**
   - Username: `sadmin`
   - Password: `@@private!lgn`
   - Status: Active
   - Role: Primary administrator

## 🔒 **Security Best Practices**

### 1. **Regular Review**
- Run `npm run track-admins` monthly
- Remove inactive admin accounts
- Update passwords regularly

### 2. **Strong Passwords**
- Use 12+ characters
- Include uppercase, lowercase, numbers, symbols
- Don't reuse passwords from other sites

### 3. **Access Control**
- Only create admin accounts when needed
- Document why each admin account exists
- Remove accounts when people leave

### 4. **Monitoring**
- Check admin login logs regularly
- Monitor for unusual login patterns
- Set up alerts for failed login attempts

## 🚨 **Emergency Procedures**

### If Admin Account is Compromised:
1. **Immediately change password:**
   ```bash
   node track-admins.js add sadmin NewSecurePassword123!
   ```

2. **Update Vercel immediately:**
   - Copy new ADMIN_USERS configuration
   - Update in Vercel dashboard
   - Force redeploy

3. **Check audit logs:**
   - Review recent admin actions
   - Look for unauthorized changes

4. **Rotate JWT secret:**
   - Generate new JWT_SECRET
   - Update in Vercel
   - All sessions will be invalidated

## 📊 **Admin Account Audit**

Run this monthly security audit:

1. **List all admins:**
   ```bash
   npm run track-admins
   ```

2. **Test each account:**
   ```bash
   node track-admins.js test username password
   ```

3. **Check production deployment:**
   ```bash
   npm run test-production https://your-app.vercel.app
   ```

4. **Verify security settings:**
   - Check environment variables in Vercel
   - Verify HTTPS is working
   - Test brute force protection

## 📝 **Adding Multiple Admins**

To add multiple admins at once:

1. **Generate each admin:**
   ```bash
   node track-admins.js add admin1 Password1!
   node track-admins.js add admin2 Password2!
   node track-admins.js add admin3 Password3!
   ```

2. **Manually combine the hashes:**
   Create a JSON array with all admin objects:
   ```json
   [
     {"username":"sadmin","passwordHash":"$2a$12$..."},
     {"username":"admin1","passwordHash":"$2a$12$..."},
     {"username":"admin2","passwordHash":"$2a$12$..."}
   ]
   ```

3. **Update Vercel with combined array**

## 🔍 **Troubleshooting**

### Login Not Working?
1. **Test credentials locally:**
   ```bash
   node track-admins.js test username password
   ```

2. **Check Vercel environment variables**
3. **Verify ADMIN_USERS format is correct JSON**
4. **Check Vercel function logs for errors**

### Can't Remember Password?
1. **Check the admin tracker:**
   ```bash
   npm run track-admins
   ```

2. **Or generate a new password:**
   ```bash
   node track-admins.js add sadmin NewPassword123!
   ```

---

**🎯 Keep this guide handy for managing your admin users!**
