#!/usr/bin/env node
/**
 * Simple Admin Tracker
 * Keep track of your admin credentials securely
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';

// Track your current admin users
const getCurrentAdmins = () => {
  return [
    {
      username: 'sadmin',
      password: '@@private!lgn',
      passwordHash: '$2a$12$8QcSICxxd2zg4vUwKpI8j.vWU2ymQAkfzzzr51Bbfy1TKhx99o3Xq',
      status: 'active',
      createdAt: new Date().toISOString(),
      notes: 'Primary admin account'
    },
    {
     username: 'supersuper',
     password: '@1234!@',
     passwordHash: '$2a$12$UsPcMPpivwmgXUyVWQgoPOZbvbKpPJUa6PdAfe9xpsJ.yrjRAOeLW',
     status: 'active',
     createdAt: new Date().toISOString(),
     notes: 'Added on 5/7/2025'
   }
  ];
};

const getCurrentJWT = () => {
  return '5bb0934c81f60810cfc5c13525a0e6942a9ea3294b4b5735caea5d4861b40eb073504b7ad0fb8040e3e1cc226accd71e827aa3143f10787465e3c690d91f6320';
};

// Display current admin users
function showCurrentAdmins() {
  const admins = getCurrentAdmins();
  const jwtSecret = getCurrentJWT();
  
  console.log('🔐 Current Admin Credentials');
  console.log('============================\n');
  
  console.log('👥 Active Admin Users:');
  console.log('----------------------');
  admins.forEach((admin, index) => {
    console.log(`${index + 1}. Username: ${admin.username}`);
    console.log(`   Password: ${admin.password}`);
    console.log(`   Status: ${admin.status}`);
    console.log(`   Created: ${admin.createdAt}`);
    console.log(`   Notes: ${admin.notes}`);
    console.log('');
  });
  
  console.log('🔑 JWT Secret Status: Set ✅');
  console.log(`📊 Total Active Admins: ${admins.length}`);
  console.log('\n🚀 Production Deployment:');
  console.log('==========================');
  console.log('Copy these to Vercel:');
  console.log('');
  console.log('ADMIN_USERS:');
  console.log(JSON.stringify(admins.map(a => ({username: a.username, passwordHash: a.passwordHash}))));
  console.log('');
  console.log('JWT_SECRET:');
  console.log(jwtSecret);
}

// Add a new admin
async function addNewAdmin(username, password) {
  if (!username || !password) {
    console.log('❌ Please provide username and password');
    console.log('Usage: node track-admins.js add <username> <password>');
    return;
  }
  
  console.log(`🔐 Adding new admin: ${username}`);
  
  // Generate hash
  const passwordHash = await bcrypt.hash(password, 12);
  
  console.log('✅ Admin credentials generated successfully!');
  console.log('');
  console.log('📋 New Admin Details:');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${passwordHash}`);
  console.log('');
  console.log('🚨 MANUAL STEPS TO MAKE THIS USER VALID:');
  console.log('========================================');
  console.log('');
  console.log('1️⃣ ADD TO track-admins.js:');
  console.log('   - Edit the getCurrentAdmins() function');
  console.log('   - Add this object to the array:');
  console.log('   {');
  console.log(`     username: '${username}',`);
  console.log(`     password: '${password}',`);
  console.log(`     passwordHash: '${passwordHash}',`);
  console.log(`     status: 'active',`);
  console.log(`     createdAt: new Date().toISOString(),`);
  console.log(`     notes: 'Added on ${new Date().toLocaleDateString()}'`);
  console.log('   }');
  console.log('');
  console.log('2️⃣ UPDATE vite.config.js:');
  console.log('   - Add to adminUsers array:');
  console.log('   {');
  console.log(`     username: '${username}',`);
  console.log(`     passwordHash: '${passwordHash}'`);
  console.log('   }');
  console.log('');
  console.log('3️⃣ UPDATE Vercel Environment:');
  console.log('   - Go to Vercel dashboard → Settings → Environment Variables');
  console.log('   - Update ADMIN_USERS with new array including this user');
  console.log('   - Redeploy your app');
  console.log('');
  console.log('4️⃣ UPDATE PRODUCTION_VARS.md:');
  console.log('   - Add this user to your local documentation');
  console.log('');
  console.log('💡 TIP: Run "node track-admins.js list" after step 1 to see updated list');
}

// Delete an admin
function deleteAdmin(username) {
  if (!username) {
    console.log('❌ Please provide username');
    console.log('Usage: node track-admins.js delete <username>');
    return;
  }
  
  console.log(`🗑️  Deleting admin: ${username}`);
  console.log('');
  console.log('⚠️  MANUAL DELETION STEPS:');
  console.log('==========================');
  console.log('1. Remove this user from the getCurrentAdmins() function in track-admins.js');
  console.log('2. Remove from vite.config.js adminUsers array');
  console.log('3. Update Vercel ADMIN_USERS environment variable');
  console.log('4. Update your PRODUCTION_VARS.md file');
  console.log('');
  console.log('📍 Current admin users to help you identify which to remove:');
  
  const admins = getCurrentAdmins();
  admins.forEach((admin, index) => {
    const isTarget = admin.username === username;
    console.log(`${index + 1}. ${admin.username} ${isTarget ? '← DELETE THIS ONE' : ''}`);
  });
  
  if (!admins.find(a => a.username === username)) {
    console.log(`❌ Username "${username}" not found in current admins`);
  }
}

// Test credentials
async function testCredentials(username, password) {
  const admins = getCurrentAdmins();
  const admin = admins.find(a => a.username === username);
  
  if (!admin) {
    console.log(`❌ Username "${username}" not found`);
    return;
  }
  
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  console.log(`🔍 Testing credentials for: ${username}`);
  console.log(`Password match: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  
  if (!isValid) {
    console.log('🔑 Expected password:', admin.password);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'list':
    case 'show':
    default:
      showCurrentAdmins();
      break;
      
    case 'add':
      await addNewAdmin(args[1], args[2]);
      break;
      
    case 'delete':
    case 'remove':
      deleteAdmin(args[1]);
      break;
      
    case 'test':
      await testCredentials(args[1], args[2]);
      break;
      
    case 'help':
      console.log('🔐 Admin Credentials Tracker');
      console.log('============================');
      console.log('');
      console.log('Commands:');
      console.log('  list/show                - Show current admin users');
      console.log('  add <user> <password>    - Generate new admin user');
      console.log('  delete <user>            - Get steps to delete admin user');
      console.log('  test <user> <password>   - Test credentials');
      console.log('  help                     - Show this help');
      console.log('');
      console.log('Examples:');
      console.log('  node track-admins.js list');
      console.log('  node track-admins.js add newadmin mypassword123');
      console.log('  node track-admins.js delete sadmin');
      console.log('  node track-admins.js test sadmin "@@private!lgn"');
      break;
  }
}

main().catch(console.error);
