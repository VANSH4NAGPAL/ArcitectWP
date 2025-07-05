// Quick JWT Secret Generator
// Run this file with: node generate-jwt-secret.js

const crypto = require('crypto');

console.log('🔐 JWT Secret Generator');
console.log('======================');

// Generate a 64-byte random secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ Your secure JWT secret:');
console.log(secret);

console.log('\n📋 Copy this to your .env.production file:');
console.log(`JWT_SECRET=${secret}`);

console.log('\n📋 Copy this to Vercel Environment Variables:');
console.log(`Variable Name: JWT_SECRET`);
console.log(`Variable Value: ${secret}`);

console.log('\n🔒 Security Notes:');
console.log('- This is a 128-character hexadecimal string (64 bytes)');
console.log('- Never share this secret publicly');
console.log('- Store it securely in environment variables only');
console.log('- Regenerate periodically for maximum security');
