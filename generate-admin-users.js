#!/usr/bin/env node
/**
 * Multi-Admin Password Hash Generator
 * Usage: node generate-admin-users.js
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Configuration for admin users
const adminUsers = [
  {
    username: 'admin',
    password: 'admin123!@#' // Change this to a secure password
  },
  {
    username: 'superadmin',
    password: 'super456$%^' // Change this to a secure password
  }
];

async function generateAdminConfig() {
  console.log('🔐 Generating Multi-Admin Configuration...\n');
  
  // Generate password hashes
  const hashedUsers = await Promise.all(
    adminUsers.map(async (user) => {
      const hash = await bcrypt.hash(user.password, 12);
      console.log(`✅ User: ${user.username}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Hash: ${hash}\n`);
      
      return {
        username: user.username,
        passwordHash: hash
      };
    })
  );
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  
  console.log('📋 Environment Variables for Production:');
  console.log('=====================================');
  console.log(`ADMIN_USERS='${JSON.stringify(hashedUsers)}'`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log('');
  
  console.log('📋 For Single Admin Mode (Backward Compatibility):');
  console.log('==================================================');
  console.log(`ADMIN_PASSWORD_HASH=${hashedUsers[0].passwordHash}`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log('');
  
  console.log('🔧 Local Development (vite.config.js):');
  console.log('=====================================');
  console.log('Update the adminUsers array in vite.config.js with:');
  console.log(JSON.stringify(hashedUsers, null, 2));
  console.log('');
  
  console.log('📚 Setup Instructions:');
  console.log('======================');
  console.log('1. Copy the ADMIN_USERS environment variable to your production environment');
  console.log('2. Update the adminUsers array in vite.config.js for local development');
  console.log('3. Set the JWT_SECRET in both environments');
  console.log('4. Test login with the generated usernames and passwords');
  console.log('');
  
  console.log('⚠️  SECURITY NOTES:');
  console.log('==================');
  console.log('- Change the default passwords before production use');
  console.log('- Use strong, unique passwords for each admin');
  console.log('- Keep the JWT_SECRET secure and rotate it regularly');
  console.log('- Store environment variables securely (Vercel dashboard)');
}

generateAdminConfig().catch(console.error);
