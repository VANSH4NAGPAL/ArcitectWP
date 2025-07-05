#!/usr/bin/env node
/**
 * Custom Admin Credentials Generator
 * Usage: node generate-custom-admin.js
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function generateCustomAdmin() {
  console.log('🔐 Custom Admin Credentials Generator\n');
  console.log('⚠️  Important: Use strong passwords (12+ characters, mixed case, numbers, symbols)\n');
  
  const admins = [];
  
  while (true) {
    const username = await askQuestion('Enter username (or "done" to finish): ');
    
    if (username.toLowerCase() === 'done') {
      break;
    }
    
    if (!username.trim()) {
      console.log('❌ Username cannot be empty. Try again.\n');
      continue;
    }
    
    // Check for duplicate usernames
    if (admins.find(admin => admin.username === username)) {
      console.log('❌ Username already exists. Choose a different one.\n');
      continue;
    }
    
    const password = await askQuestion(`Enter password for "${username}": `);
    
    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters. Try again.\n');
      continue;
    }
    
    console.log(`\n🔄 Generating hash for "${username}"...`);
    const passwordHash = await bcrypt.hash(password, 12);
    
    admins.push({
      username,
      password,
      passwordHash
    });
    
    console.log(`✅ Added admin: ${username}\n`);
  }
  
  if (admins.length === 0) {
    console.log('❌ No admins created. Exiting.');
    rl.close();
    return;
  }
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 CUSTOM ADMIN CREDENTIALS GENERATED');
  console.log('='.repeat(60));
  
  console.log('\n📋 Your Admin Accounts:');
  admins.forEach((admin, index) => {
    console.log(`${index + 1}. Username: ${admin.username} | Password: ${admin.password}`);
  });
  
  console.log('\n🔐 Environment Variables for Vercel:');
  console.log('=====================================');
  
  const adminUsers = admins.map(admin => ({
    username: admin.username,
    passwordHash: admin.passwordHash
  }));
  
  console.log(`ADMIN_USERS='${JSON.stringify(adminUsers)}'`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  
  console.log('\n📝 Copy-Paste Ready:');
  console.log('===================');
  console.log('Variable 1:');
  console.log(`Name: ADMIN_USERS`);
  console.log(`Value: ${JSON.stringify(adminUsers)}`);
  console.log('');
  console.log('Variable 2:');
  console.log(`Name: JWT_SECRET`);
  console.log(`Value: ${jwtSecret}`);
  
  console.log('\n🔧 For Local Development:');
  console.log('Update vite.config.js adminUsers array with:');
  console.log(JSON.stringify(adminUsers, null, 2));
  
  console.log('\n⚠️  SECURITY REMINDERS:');
  console.log('- Save these credentials securely');
  console.log('- Use these values in your Vercel dashboard');
  console.log('- Update local development config');
  console.log('- Never commit passwords to Git');
  
  rl.close();
}

generateCustomAdmin().catch(console.error);
