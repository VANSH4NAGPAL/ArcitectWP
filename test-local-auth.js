#!/usr/bin/env node

/**
 * Local Development Test Script
 * Tests the headinfo authentication setup
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';

async function testAdminAuth() {
  console.log('🧪 Testing ArchitectWP Headinfo Authentication...\n');

  try {
    // Test 1: Headinfo login
    console.log('1. Testing headinfo login...');
    const loginResponse = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: '@admin!1234'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok && loginData.success) {
      console.log('✅ Headinfo login successful');
      console.log('🔑 JWT Token received:', loginData.token ? 'Yes' : 'No');
      
      // Test 2: Token verification
      console.log('\n2. Testing token verification...');
      const verifyResponse = await fetch(`${BASE_URL}/api/headinfo/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: loginData.token
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyResponse.ok && verifyData.valid) {
        console.log('✅ Token verification successful');
        console.log('👤 Admin status:', verifyData.admin ? 'Confirmed' : 'Failed');
      } else {
        console.log('❌ Token verification failed');
      }

      // Test 3: Audit logging
      console.log('\n3. Testing audit logging...');
      const auditResponse = await fetch(`${BASE_URL}/api/headinfo/store-audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test_audit',
          details: 'Testing audit logging system',
          timestamp: new Date().toISOString()
        })
      });

      const auditData = await auditResponse.json();
      
      if (auditResponse.ok && auditData.success) {
        console.log('✅ Audit logging successful');
      } else {
        console.log('❌ Audit logging failed');
      }

    } else {
      console.log('❌ Headinfo login failed');
      console.log('Error:', loginData.error || 'Unknown error');
    }

    // Test 4: Invalid password
    console.log('\n4. Testing invalid password...');
    const invalidResponse = await fetch(`${BASE_URL}/api/headinfo/auth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'wrongpassword'
      })
    });

    await invalidResponse.json(); // Consume response body
    
    if (invalidResponse.status === 401) {
      console.log('✅ Invalid password correctly rejected');
    } else {
      console.log('❌ Invalid password not properly rejected');
    }

    console.log('\n🎉 Authentication tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Navigate to http://localhost:5173/headinfo');
    console.log('2. Login with password: @admin!1234');
    console.log('3. Test headinfo panel functionality');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure dev server is running: npm run dev');
    console.log('2. Check that port 5173 is available');
    console.log('3. Verify .env.local file exists with correct variables');
  }
}

// Run tests
testAdminAuth();
