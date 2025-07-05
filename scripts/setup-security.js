#!/usr/bin/env node

/**
 * ArchitectWP Production Deployment Setup Script
 * This script helps set up the production environment securely
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('🚀 ArchitectWP Security Setup Script');
console.log('=====================================');

// Check if required packages are installed
function checkDependencies() {
  console.log('\n📦 Checking dependencies...');
  
  const requiredPackages = ['bcryptjs', 'jsonwebtoken'];
  const missing = [];
  
  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
      console.log(`✅ ${pkg} - installed`);
    } catch {
      missing.push(pkg);
      console.log(`❌ ${pkg} - missing`);
    }
  }
  
  if (missing.length > 0) {
    console.log(`\n🔧 Installing missing packages: ${missing.join(', ')}`);
    execSync(`npm install ${missing.join(' ')}`, { stdio: 'inherit' });
  }
}

// Generate secure secrets
function generateSecrets() {
  console.log('\n🔐 Generating secure secrets...');
  
  const crypto = require('crypto');
  const bcrypt = require('bcryptjs');
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  console.log('✅ JWT Secret generated (64 bytes)');
  
  // Get password from user (in real script, use readline)
  const defaultPassword = 'ChangeMe123!'; // This should be changed
  console.log(`⚠️  Using default password: ${defaultPassword}`);
  console.log('   🚨 CHANGE THIS IN PRODUCTION!');
  
  // Generate password hash
  const passwordHash = bcrypt.hashSync(defaultPassword, 12);
  console.log('✅ Password hash generated (bcrypt rounds: 12)');
  
  return {
    jwtSecret,
    passwordHash,
    password: defaultPassword
  };
}

// Create environment file
function createEnvFile(secrets) {
  console.log('\n📝 Creating environment file...');
  
  const envContent = `# ArchitectWP Production Environment
# Generated on ${new Date().toISOString()}

# Admin Authentication
ADMIN_PASSWORD_HASH=${secrets.passwordHash}
JWT_SECRET=${secrets.jwtSecret}

# Optional: Redis for distributed rate limiting
# REDIS_URL=redis://user:password@your-redis-host:6379

# Optional: Firebase for audit logging
# FIREBASE_PROJECT_ID=your-firebase-project-id

# Optional: External audit webhook
# AUDIT_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url

# Security Configuration
SECURITY_HEADERS_ENABLED=true
HSTS_MAX_AGE=31536000
`;

  writeFileSync('.env.production', envContent);
  console.log('✅ .env.production created');
  
  // Also create .env.local for development
  writeFileSync('.env.local', envContent);
  console.log('✅ .env.local created (for development)');
}

// Verify Vercel configuration
function checkVercelConfig() {
  console.log('\n⚙️  Checking Vercel configuration...');
  
  if (existsSync('vercel.json')) {
    const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
    
    if (vercelConfig.headers) {
      console.log('✅ Security headers configured in vercel.json');
    } else {
      console.log('⚠️  No security headers found in vercel.json');
    }
  } else {
    console.log('❌ vercel.json not found');
    
    // Create basic vercel.json with security headers
    const vercelConfig = {
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            {
              "key": "X-Content-Type-Options",
              "value": "nosniff"
            },
            {
              "key": "X-Frame-Options",
              "value": "DENY"
            },
            {
              "key": "X-XSS-Protection",
              "value": "1; mode=block"
            },
            {
              "key": "Strict-Transport-Security",
              "value": "max-age=31536000; includeSubDomains"
            }
          ]
        }
      ]
    };
    
    writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    console.log('✅ Created vercel.json with security headers');
  }
}

// Main setup function
async function setup() {
  try {
    checkDependencies();
    const secrets = generateSecrets();
    createEnvFile(secrets);
    checkVercelConfig();
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. 🔐 Change the default password in .env.production');
    console.log('2. 🚀 Deploy to Vercel: npx vercel --prod');
    console.log('3. ⚙️  Set environment variables in Vercel dashboard');
    console.log('4. 🧪 Test all security features');
    console.log('5. 📊 Set up monitoring and alerting');
    
    console.log('\n🔑 Generated credentials:');
    console.log(`   Password: ${secrets.password} (CHANGE THIS!)`);
    console.log(`   JWT Secret: ${secrets.jwtSecret.substring(0, 20)}...`);
    
    console.log('\n⚠️  Security reminders:');
    console.log('   - Change the default password');
    console.log('   - Verify HTTPS is enabled');
    console.log('   - Test brute force protection');
    console.log('   - Set up audit log monitoring');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();
