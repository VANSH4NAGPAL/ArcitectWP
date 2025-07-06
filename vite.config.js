import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Local API handler for development
function handleLocalAPI(req, res) {
  return new Promise((resolve) => {
    const url = req.originalUrl || req.url; // Use originalUrl to get full path
    const method = req.method;

    // Set CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    console.log(`🔄 Handling: ${method} ${url}`);

    // Handle preflight requests
    if (method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      resolve();
      return;
    }

    // Handle ImageKit auth endpoint
    if (url.includes('/auth') && method === 'GET') {
      import('crypto').then(crypto => {
        try {
          // Mock ImageKit auth for local development
          const mockPrivateKey = 'private_mock_key_for_local_development_only';
          
          // Generate authentication parameters
          const token = crypto.randomUUID();
          const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
          
          // Create signature
          const signature = crypto
            .createHmac('sha1', mockPrivateKey)
            .update(token + expire)
            .digest('hex');

          console.log('🔐 ImageKit auth generated for local dev');
          res.statusCode = 200;
          res.end(JSON.stringify({
            token,
            expire,
            signature
          }));
          resolve();
        } catch (error) {
          console.error('Error generating ImageKit auth:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to generate authentication' }));
          resolve();
        }
      }).catch(error => {
        console.error('Error importing crypto:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to import crypto module' }));
        resolve();
      });
      return;
    }

    // Handle auth-login endpoint
    if (url.includes('/auth-login') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        Promise.all([
          import('bcryptjs'),
          import('jsonwebtoken')
        ]).then(([bcrypt, jwt]) => {
          try {
            const { username, password } = JSON.parse(body);
            
            console.log('🔐 Testing credentials...');
            console.log('Username received:', username || 'none');
            console.log('Password received:', password ? '***' : 'none');
            
            let isValid = false;
            let adminUser = null;
            
            // Multi-admin configuration (you can extend this)
            const adminUsers = [
              {
                username: 'only@admin',
                passwordHash: '$2a$12$Z24/i/5YN.z1Gb5/tBCPpulufV0bUqL4y2kgedPcTOOWcr6POevcm'
              }
            ];
            
            // Legacy password hash for backward compatibility
            const legacyHash = '$2a$12$LplY7HMm9vW8ZVD8pl6/IePbasEhRecG91H07gCV6RpJCJKRbw/lG'; // @admin!1234
            
            if (username && password) {
              // Multi-admin mode: check username and password
              adminUser = adminUsers.find(user => user.username === username);
              if (adminUser) {
                // Handle different bcrypt import structures
                const compareSync = bcrypt.compareSync || bcrypt.default?.compareSync || bcrypt.default;
                isValid = compareSync(password, adminUser.passwordHash);
                console.log(`Found user: ${username}, password valid: ${isValid}`);
              } else {
                console.log(`User not found: ${username}`);
              }
            } else if (password && !username) {
              // Backward compatibility: password-only mode
              adminUser = { username: 'admin' };
              const compareSync = bcrypt.compareSync || bcrypt.default?.compareSync || bcrypt.default;
              isValid = compareSync(password, legacyHash);
              console.log(`Legacy mode, password valid: ${isValid}`);
            } else {
              console.log('Missing username or password');
            }
            
            const jwtSecret = '369d93f8bb3c8d5e1165067cfbfe32ec8bbb5642495c28886d084d0609447a3752636ae4c60048cd3ceaf37e5d0f5b8b2ad4d42e38610efeccd94c2f17d76ac2';
            
            if (isValid && adminUser) {
              console.log('✅ Authentication successful');
              const jwtSign = jwt.sign || jwt.default?.sign || jwt.default;
              const token = jwtSign(
                { 
                  admin: true, 
                  username: adminUser.username,
                  timestamp: Date.now() 
                },
                jwtSecret,
                { expiresIn: '2h' }
              );
              const response = { 
                success: true, 
                token,
                username: adminUser.username
              };
              console.log('📤 Sending auth response:', response);
              res.statusCode = 200;
              res.end(JSON.stringify(response));
            } else {
              console.log('❌ Authentication failed');
              const errorResponse = { error: 'Invalid credentials' };
              console.log('📤 Sending error response:', errorResponse);
              res.statusCode = 401;
              res.end(JSON.stringify(errorResponse));
            }
          } catch (err) {
            console.error('Local API Error:', err);
            const serverErrorResponse = { error: 'Server error' };
            console.log('📤 Sending server error response:', serverErrorResponse);
            res.statusCode = 500;
            res.end(JSON.stringify(serverErrorResponse));
          }
          resolve();
        }).catch(err => {
          console.error('Error importing modules:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Server error' }));
          resolve();
        });
      });
      return;
    }

    // Handle verify-token endpoint
    if (url.includes('/verify-token') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        import('jsonwebtoken').then(jwt => {
          try {
            const { token } = JSON.parse(body);
            console.log('🔍 Verifying token:', token ? 'Token provided' : 'No token');
            
            const jwtSecret = '369d93f8bb3c8d5e1165067cfbfe32ec8bbb5642495c28886d084d0609447a3752636ae4c60048cd3ceaf37e5d0f5b8b2ad4d42e38610efeccd94c2f17d76ac2';
            
            const jwtVerify = jwt.verify || jwt.default?.verify || jwt.default;
            const decoded = jwtVerify(token, jwtSecret);
            console.log('✅ Token verification successful', { 
              admin: decoded.admin, 
              username: decoded.username || 'admin',
              exp: decoded.exp 
            });
            res.statusCode = 200;
            res.end(JSON.stringify({ 
              valid: true, 
              admin: decoded.admin,
              username: decoded.username || 'admin'
            }));
          } catch (error) {
            console.log('❌ Token verification failed:', error.message);
            res.statusCode = 401;
            res.end(JSON.stringify({ valid: false, error: 'Invalid token' }));
          }
          resolve();
        }).catch(error => {
          console.error('Error importing jwt:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Server error' }));
          resolve();
        });
      });
      return;
    }

    // Handle store-audit endpoint
    if (url.includes('/store-audit') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const auditData = JSON.parse(body);
          console.log('🔍 Local Audit Log:', {
            timestamp: new Date().toISOString(),
            ...auditData
          });
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: 'Audit logged locally' }));
        } catch {
          console.error('Audit logging error');
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Server error' }));
        }
        resolve();
      });
      return;
    }

    // Handle rate-limit endpoint with actual rate limiting for testing
    if (url.includes('/rate-limit') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'localhost';
          
          // Initialize in-memory store for development
          if (!globalThis.devRateLimitStore) {
            globalThis.devRateLimitStore = new Map();
          }
          
          const key = `rate_limit:${clientIp}`;
          const now = Date.now();
          
          console.log('🔄 Rate limit check:', data.action || 'unknown', 'for IP:', clientIp);
          
          if (data.action === 'check') {
            const record = globalThis.devRateLimitStore.get(key);
            if (record && record.attempts >= 3) {
              const remainingTime = Math.max(0, Math.ceil((record.expiresAt - now) / 1000));
              if (remainingTime > 0) {
                res.statusCode = 429;
                res.end(JSON.stringify({
                  blocked: true,
                  remainingTime: remainingTime,
                  message: `IP blocked in dev. Try again in ${Math.ceil(remainingTime/60)} minutes`
                }));
                resolve();
                return;
              } else {
                // Expired, remove the record
                globalThis.devRateLimitStore.delete(key);
              }
            }
            
            res.statusCode = 200;
            res.end(JSON.stringify({
              blocked: false,
              attempts: record ? record.attempts : 0,
              remainingAttempts: record ? Math.max(0, 3 - record.attempts) : 3
            }));
            
          } else if (data.action === 'record_failed') {
            const record = globalThis.devRateLimitStore.get(key) || { attempts: 0, expiresAt: 0 };
            record.attempts += 1;
            record.expiresAt = now + (15 * 60 * 1000); // 15 minutes
            globalThis.devRateLimitStore.set(key, record);
            
            res.statusCode = 200;
            res.end(JSON.stringify({
              blocked: record.attempts >= 3,
              attempts: record.attempts,
              remainingAttempts: Math.max(0, 3 - record.attempts)
            }));
            
          } else if (data.action === 'clear') {
            globalThis.devRateLimitStore.delete(key);
            res.statusCode = 200;
            res.end(JSON.stringify({
              blocked: false,
              attempts: 0,
              message: 'Dev rate limit cleared'
            }));
            
          } else {
            res.statusCode = 200;
            res.end(JSON.stringify({ 
              blocked: false, 
              attempts: 0, 
              message: 'Unknown action in development' 
            }));
          }
          
        } catch (err) {
          console.error('Rate limit parsing error:', err);
          res.statusCode = 200;
          res.end(JSON.stringify({ 
            blocked: false, 
            attempts: 0, 
            message: 'Rate limiting error in development (fallback)' 
          }));
        }
        resolve();
      });
      return;
    }

    // Handle audit-log endpoint (mock - return empty logs)
    if (url.includes('/audit-log') && method === 'GET') {
      res.statusCode = 200;
      res.end(JSON.stringify({ logs: [], message: 'Local development - no persistent audit logs' }));
      resolve();
      return;
    }

    // Handle other headinfo endpoints
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Local dev endpoint', 
      url, 
      method,
      note: 'This is a development mock endpoint'
    }));
    resolve();
  });
}

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Custom plugin to handle headinfo API locally
      {
        name: 'local-headinfo-api',
        configureServer(server) {
          server.middlewares.use('/api/headinfo', (req, res) => {
            console.log(`🔄 Intercepting local API call: ${req.method} ${req.url}`);
            handleLocalAPI(req, res);
          });
        }
      },
      // Custom plugin to handle auth API locally
      {
        name: 'local-auth-api',
        configureServer(server) {
          server.middlewares.use('/api/auth', (req, res) => {
            console.log(`🔄 Intercepting auth API call: ${req.method} ${req.url}`);
            handleLocalAPI(req, res);
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'ui': ['framer-motion'],
            'firebase': ['firebase/app', 'firebase/firestore']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  }
})
