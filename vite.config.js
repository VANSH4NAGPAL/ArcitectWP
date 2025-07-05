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

    // Handle auth-login endpoint
    if (url.includes('/auth-login') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        try {
          const { username, password } = JSON.parse(body);
          
          // Dynamic import for Node.js modules in ESM context
          const bcrypt = await import('bcryptjs');
          const jwt = await import('jsonwebtoken');
          
          console.log('🔐 Testing credentials...');
          console.log('Username received:', username || 'none');
          console.log('Password received:', password ? '***' : 'none');
          
          let isValid = false;
          let adminUser = null;
          
          // Multi-admin configuration (you can extend this)
          const adminUsers = [
            {
              username: 'sadmin',
              passwordHash: '$2a$12$8QcSICxxd2zg4vUwKpI8j.vWU2ymQAkfzzzr51Bbfy1TKhx99o3Xq' // @@private!lgn
            }
          ];
          
          // Legacy password hash for backward compatibility
          const legacyHash = '$2a$12$LplY7HMm9vW8ZVD8pl6/IePbasEhRecG91H07gCV6RpJCJKRbw/lG'; // @admin!1234
          
          if (username && password) {
            // Multi-admin mode: check username and password
            adminUser = adminUsers.find(user => user.username === username);
            if (adminUser) {
              isValid = bcrypt.default.compareSync(password, adminUser.passwordHash);
              console.log(`Found user: ${username}, password valid: ${isValid}`);
            } else {
              console.log(`User not found: ${username}`);
            }
          } else if (password && !username) {
            // Backward compatibility: password-only mode
            adminUser = { username: 'admin' };
            isValid = bcrypt.default.compareSync(password, legacyHash);
            console.log(`Legacy mode, password valid: ${isValid}`);
          } else {
            console.log('Missing username or password');
          }
          
          const jwtSecret = '369d93f8bb3c8d5e1165067cfbfe32ec8bbb5642495c28886d084d0609447a3752636ae4c60048cd3ceaf37e5d0f5b8b2ad4d42e38610efeccd94c2f17d76ac2';
          
          if (isValid && adminUser) {
            console.log('✅ Authentication successful');
            const token = jwt.default.sign(
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
      });
      return;
    }

    // Handle verify-token endpoint
    if (url.includes('/verify-token') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        try {
          const { token } = JSON.parse(body);
          console.log('🔍 Verifying token:', token ? 'Token provided' : 'No token');
          
          const jwt = await import('jsonwebtoken');
          const jwtSecret = '369d93f8bb3c8d5e1165067cfbfe32ec8bbb5642495c28886d084d0609447a3752636ae4c60048cd3ceaf37e5d0f5b8b2ad4d42e38610efeccd94c2f17d76ac2';
          
          const decoded = jwt.default.verify(token, jwtSecret);
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

    // Handle rate-limit endpoint (mock - always allow in dev)
    if (url.includes('/rate-limit') && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log('🔄 Rate limit check:', data.action || 'unknown');
          
          // Mock response based on action
          const mockResponse = {
            blocked: false,
            attempts: 0,
            allowed: true,
            message: `Rate limiting bypassed in development (action: ${data.action || 'check'})`
          };
          
          res.statusCode = 200;
          res.end(JSON.stringify(mockResponse));
        } catch (err) {
          console.error('Rate limit parsing error:', err);
          res.statusCode = 200; // Still allow in dev even if parsing fails
          res.end(JSON.stringify({ 
            blocked: false, 
            attempts: 0, 
            allowed: true, 
            message: 'Rate limiting bypassed in development (fallback)' 
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
