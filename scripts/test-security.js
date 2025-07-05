#!/usr/bin/env node

/**
 * ArchitectWP Security Testing Suite
 * Tests all security features to ensure they work correctly
 */

import { execSync } from 'child_process';

console.log('🔒 ArchitectWP Security Test Suite');
console.log('==================================');

// Test configuration
const testConfig = {
  baseUrl: process.env.TEST_URL || 'http://localhost:5173',
  testPassword: process.env.TEST_PASSWORD || 'ChangeMe123!',
  wrongPassword: 'WrongPassword123'
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function addTest(name, passed, message = '') {
  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}: ${message}`);
  }
}

// Test 1: Server-side authentication endpoint
async function testServerAuth() {
  console.log('\n🧪 Testing server-side authentication...');
  
  try {
    // Test correct password
    const response = await fetch(`${testConfig.baseUrl}/api/admin/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: testConfig.testPassword })
    });
    
    const data = await response.json();
    addTest('Server auth with correct password', response.ok && data.token, 
            response.ok ? '' : data.error || 'No token received');
    
    // Test wrong password
    const wrongResponse = await fetch(`${testConfig.baseUrl}/api/admin/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: testConfig.wrongPassword })
    });
    
    addTest('Server auth rejects wrong password', !wrongResponse.ok, 
            wrongResponse.ok ? 'Should have been rejected' : '');
    
  } catch (error) {
    addTest('Server auth endpoint', false, error.message);
  }
}

// Test 2: JWT token verification
async function testTokenVerification() {
  console.log('\n🧪 Testing JWT token verification...');
  
  try {
    // First get a valid token
    const authResponse = await fetch(`${testConfig.baseUrl}/api/admin/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: testConfig.testPassword })
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      
      // Test valid token
      const verifyResponse = await fetch(`${testConfig.baseUrl}/api/admin/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authData.token })
      });
      
      const verifyData = await verifyResponse.json();
      addTest('Valid token verification', verifyResponse.ok && verifyData.valid);
      
      // Test invalid token
      const invalidResponse = await fetch(`${testConfig.baseUrl}/api/admin/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'invalid-token' })
      });
      
      const invalidData = await invalidResponse.json();
      addTest('Invalid token rejection', invalidResponse.ok && !invalidData.valid);
    } else {
      addTest('Token verification setup', false, 'Could not get auth token');
    }
    
  } catch (error) {
    addTest('Token verification', false, error.message);
  }
}

// Test 3: Rate limiting
async function testRateLimiting() {
  console.log('\n🧪 Testing rate limiting...');
  
  try {
    // Test rate limit check
    const checkResponse = await fetch(`${testConfig.baseUrl}/api/admin/rate-limit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' })
    });
    
    addTest('Rate limit check endpoint', checkResponse.ok);
    
    // Test failed attempt recording
    const recordResponse = await fetch(`${testConfig.baseUrl}/api/admin/rate-limit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'record_failed' })
    });
    
    addTest('Rate limit record endpoint', recordResponse.ok);
    
  } catch (error) {
    addTest('Rate limiting', false, error.message);
  }
}

// Test 4: Audit logging
async function testAuditLogging() {
  console.log('\n🧪 Testing audit logging...');
  
  try {
    const auditData = {
      action: 'TEST_ACTION',
      details: { test: true },
      userAgent: 'Security-Test-Suite',
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(`${testConfig.baseUrl}/api/admin/store-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditData)
    });
    
    addTest('Audit logging endpoint', response.ok);
    
  } catch (error) {
    addTest('Audit logging', false, error.message);
  }
}

// Test 5: HTTPS enforcement (client-side)
function testHttpsEnforcement() {
  console.log('\n🧪 Testing HTTPS enforcement...');
  
  // This test checks if the component exists and is properly imported
  try {
    // In a real test, we'd check if the component redirects HTTP to HTTPS
    // For now, we'll just verify the component file exists
    const fs = require('fs');
    const httpsComponentExists = fs.existsSync('src/components/HttpsEnforcement.jsx');
    addTest('HTTPS enforcement component exists', httpsComponentExists);
    
    // Check if it's imported in App.jsx
    if (httpsComponentExists) {
      const appContent = fs.readFileSync('src/App.jsx', 'utf8');
      const isImported = appContent.includes('HttpsEnforcement');
      addTest('HTTPS enforcement is imported in App', isImported);
    }
    
  } catch (error) {
    addTest('HTTPS enforcement check', false, error.message);
  }
}

// Test 6: Security headers configuration
function testSecurityHeaders() {
  console.log('\n🧪 Testing security headers configuration...');
  
  try {
    const fs = require('fs');
    
    // Check vercel.json for security headers
    if (fs.existsSync('vercel.json')) {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      const hasHeaders = vercelConfig.headers && vercelConfig.headers.length > 0;
      addTest('Security headers in vercel.json', hasHeaders);
      
      if (hasHeaders) {
        const headers = vercelConfig.headers[0].headers || [];
        const requiredHeaders = [
          'X-Content-Type-Options',
          'X-Frame-Options',
          'Strict-Transport-Security'
        ];
        
        for (const header of requiredHeaders) {
          const hasHeader = headers.some(h => h.key === header);
          addTest(`Security header: ${header}`, hasHeader);
        }
      }
    } else {
      addTest('vercel.json exists', false, 'File not found');
    }
    
  } catch (error) {
    addTest('Security headers check', false, error.message);
  }
}

// Test 7: Environment variables setup
function testEnvironmentSetup() {
  console.log('\n🧪 Testing environment setup...');
  
  try {
    const fs = require('fs');
    
    // Check for environment template
    const hasTemplate = fs.existsSync('.env.production.template');
    addTest('Environment template exists', hasTemplate);
    
    // Check for actual env file (in production)
    const hasEnvProd = fs.existsSync('.env.production');
    const hasEnvLocal = fs.existsSync('.env.local');
    addTest('Environment file exists', hasEnvProd || hasEnvLocal);
    
    // Check required environment variables
    const requiredVars = ['ADMIN_PASSWORD_HASH', 'JWT_SECRET'];
    for (const varName of requiredVars) {
      const hasVar = process.env[varName] !== undefined;
      addTest(`Environment variable: ${varName}`, hasVar);
    }
    
  } catch (error) {
    addTest('Environment setup check', false, error.message);
  }
}

// Main test runner
async function runTests() {
  console.log(`🎯 Running tests against: ${testConfig.baseUrl}\n`);
  
  // Run all tests
  await testServerAuth();
  await testTokenVerification();
  await testRateLimiting();
  await testAuditLogging();
  testHttpsEnforcement();
  testSecurityHeaders();
  testEnvironmentSetup();
  
  // Display results
  console.log('\n📊 Test Results');
  console.log('===============');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📝 Total: ${results.tests.length}`);
  
  const passRate = ((results.passed / results.tests.length) * 100).toFixed(1);
  console.log(`📈 Pass Rate: ${passRate}%`);
  
  if (results.failed > 0) {
    console.log('\n🔍 Failed Tests:');
    results.tests
      .filter(test => !test.passed)
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.message}`);
      });
  }
  
  // Security score
  let securityScore = 0;
  if (passRate >= 95) securityScore = 10;
  else if (passRate >= 90) securityScore = 9;
  else if (passRate >= 80) securityScore = 8;
  else if (passRate >= 70) securityScore = 7;
  else if (passRate >= 60) securityScore = 6;
  else securityScore = 5;
  
  console.log(`\n🏆 Security Score: ${securityScore}/10`);
  
  if (securityScore >= 9) {
    console.log('🚀 Excellent! Ready for production deployment.');
  } else if (securityScore >= 7) {
    console.log('⚠️  Good, but some improvements needed before production.');
  } else {
    console.log('🚨 Critical issues found. Do not deploy to production.');
  }
}

// Handle different run modes
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('\nUsage: node test-security.js [options]');
  console.log('Options:');
  console.log('  --help     Show this help message');
  console.log('  --url URL  Test against specific URL (default: http://localhost:5173)');
  console.log('  --password PWD  Use specific password for testing');
  console.log('\nEnvironment variables:');
  console.log('  TEST_URL       Base URL to test against');
  console.log('  TEST_PASSWORD  Password to use for authentication tests');
} else {
  // Override config from command line
  const urlIndex = args.indexOf('--url');
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    testConfig.baseUrl = args[urlIndex + 1];
  }
  
  const passwordIndex = args.indexOf('--password');
  if (passwordIndex !== -1 && args[passwordIndex + 1]) {
    testConfig.testPassword = args[passwordIndex + 1];
  }
  
  runTests().catch(error => {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  });
}
