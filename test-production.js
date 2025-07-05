#!/usr/bin/env node
/**
 * Test Production Deployment
 * Usage: node test-production.js https://your-app.vercel.app
 */

import fetch from 'node-fetch';

const args = process.argv.slice(2);
const BASE_URL = args[0] || 'https://your-app.vercel.app';

if (!args[0]) {
  console.log('❌ Please provide your Vercel app URL');
  console.log('Usage: node test-production.js https://your-app.vercel.app');
  process.exit(1);
}

async function testProduction() {
  console.log(`🧪 Testing Production Deployment: ${BASE_URL}\n`);
  
  const tests = [
    {
      name: '🌐 Website Accessibility',
      test: async () => {
        const response = await fetch(BASE_URL);
        return response.ok;
      }
    },
    {
      name: '🔐 Multi-Admin Login (admin)',
      test: async () => {
        const response = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123!@#'
          })
        });
        const data = await response.json();
        return response.ok && data.success && data.token;
      }
    },
    {
      name: '🔐 Multi-Admin Login (superadmin)',
      test: async () => {
        const response = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'superadmin',
            password: 'super456$%^'
          })
        });
        const data = await response.json();
        return response.ok && data.success && data.token;
      }
    },
    {
      name: '🔄 Legacy Password Mode',
      test: async () => {
        const response = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: '@admin!1234'
          })
        });
        const data = await response.json();
        return response.ok && data.success && data.token;
      }
    },
    {
      name: '🛡️ Invalid Credentials Rejection',
      test: async () => {
        const response = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'admin',
            password: 'wrongpassword'
          })
        });
        return !response.ok; // Should fail
      }
    },
    {
      name: '🔑 Token Verification',
      test: async () => {
        // First get a valid token
        const authResponse = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123!@#'
          })
        });
        
        if (!authResponse.ok) return false;
        
        const authData = await authResponse.json();
        
        // Then verify the token
        const verifyResponse = await fetch(`${BASE_URL}/api/headinfo/verify-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: authData.token })
        });
        
        const verifyData = await verifyResponse.json();
        return verifyResponse.ok && verifyData.valid && verifyData.admin;
      }
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.test();
      console.log(`${result ? '✅' : '❌'} ${test.name}`);
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${test.name} (Error: ${error.message})`);
    }
  }
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your deployment is working correctly.');
    console.log('\n📋 Next Steps:');
    console.log('1. Visit your live site and test the UI');
    console.log('2. Change the default passwords immediately');
    console.log('3. Set up a custom domain if desired');
    console.log('4. Monitor your deployment for any issues');
  } else {
    console.log('⚠️ Some tests failed. Check your environment variables and deployment logs.');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify ADMIN_USERS and JWT_SECRET are set in Vercel');
    console.log('2. Check Vercel function logs for errors');
    console.log('3. Ensure all API endpoints are deployed correctly');
  }
}

testProduction().catch(console.error);
