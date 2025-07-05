// Vercel Serverless Function for Headinfo Authentication
// This should be deployed as /api/headinfo/auth-login.js

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Environment variables (set in Vercel dashboard)
  // Support multiple admins: ADMIN_USERS should be a JSON string like:
  // [{"username": "admin", "passwordHash": "hash1"}, {"username": "superadmin", "passwordHash": "hash2"}]
  const ADMIN_USERS = process.env.ADMIN_USERS;
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Fallback for single admin
  const JWT_SECRET = process.env.JWT_SECRET;

  if ((!ADMIN_USERS && !ADMIN_PASSWORD_HASH) || !JWT_SECRET) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { compare } = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    const { username, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    let isValid = false;
    let adminUser = null;

    // Check if multi-admin setup is configured
    if (ADMIN_USERS) {
      try {
        const adminUsersList = JSON.parse(ADMIN_USERS);
        
        if (!username) {
          return res.status(400).json({ error: 'Username required' });
        }

        // Find the user by username
        adminUser = adminUsersList.find(user => user.username === username);
        
        if (adminUser) {
          isValid = await compare(password, adminUser.passwordHash);
        }
      } catch (parseError) {
        console.error('Error parsing ADMIN_USERS:', parseError);
        return res.status(500).json({ error: 'Server configuration error' });
      }
    } else {
      // Fallback to single admin mode (backward compatibility)
      // In single admin mode, username is optional
      isValid = await compare(password, ADMIN_PASSWORD_HASH);
      adminUser = { username: username || 'admin' };
    }

    if (!isValid) {
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      console.log(`Failed headinfo login from IP: ${clientIP} for user: ${username || 'unknown'} at ${new Date().toISOString()}`);
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.default.sign(
      { 
        admin: true,
        username: adminUser.username,
        loginTime: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60) // 2 hours
      },
      JWT_SECRET,
      { algorithm: 'HS256' }
    );

    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    console.log(`Successful headinfo login from IP: ${clientIP} for user: ${adminUser.username} at ${new Date().toISOString()}`);

    return res.status(200).json({ 
      success: true, 
      token,
      username: adminUser.username,
      expiresIn: 2 * 60 * 60 // 2 hours in seconds
    });

  } catch (error) {
    console.error('Headinfo login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
