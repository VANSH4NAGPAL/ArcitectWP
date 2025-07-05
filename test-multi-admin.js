#!/usr/bin/env node
/**
 * Test Multi-Admin Authentication
 * Usage: node test-multi-admin.js
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';

async function testAuthentication() {
  console.log('🧪 Testing Multi-Admin Authentication...\n');
  
  const testCases = [
    {
      name: 'Valid admin user',
      username: 'admin',
      password: 'admin123!@#',
      shouldPass: true
    },
    {
      name: 'Valid superadmin user', 
      username: 'superadmin',
      password: 'super456$%^',
      shouldPass: true
    },
    {
      name: 'Legacy password-only mode',
      username: '',
      password: '@admin!1234',
      shouldPass: true
    },
    {
      name: 'Invalid username',
      username: 'wronguser',
      password: 'admin123!@#',
      shouldPass: false
    },
    {
      name: 'Invalid password',
      username: 'admin',
      password: 'wrongpassword',
      shouldPass: false
    },
    {
      name: 'Empty credentials',
      username: '',
      password: '',
      shouldPass: false
    }
  ];
  
  for (const test of testCases) {
    try {
      console.log(`🔍 Testing: ${test.name}`);
      console.log(`   Username: "${test.username}"`);
      console.log(`   Password: "${test.password ? '***' : ''}"`);
      
      const response = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: test.username,
          password: test.password
        })
      });
      
      const data = await response.json();
      const passed = response.ok === test.shouldPass;
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Expected: ${test.shouldPass ? 'SUCCESS' : 'FAILURE'}`);
      console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      
      if (response.ok && data.token) {
        console.log(`   Username in response: ${data.username || 'N/A'}`);
        
        // Test token verification
        const verifyResponse = await fetch(`${BASE_URL}/api/headinfo/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: data.token })
        });
        
        const verifyData = await verifyResponse.json();
        console.log(`   Token verification: ${verifyResponse.ok ? '✅ VALID' : '❌ INVALID'}`);
        if (verifyResponse.ok) {
          console.log(`   Token username: ${verifyData.username || 'N/A'}`);
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   Error: ${error.message}`);
      console.log(`   Result: ❌ FAIL (Network Error)\n`);
    }
  }
  
  console.log('🎉 Multi-Admin Authentication Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Check the browser at http://localhost:5173');
  console.log('2. Test the show/hide password toggle');
  console.log('3. Try logging in with different admin accounts');
  console.log('4. Verify the username appears in the admin panel');
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAuthentication().catch(console.error);
}

export { testAuthentication };
