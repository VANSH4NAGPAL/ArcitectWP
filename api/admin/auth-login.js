// Vercel Serverless Function for Admin Authentication
// This should be deployed as /api/admin/login.js

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
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { compare } = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Verify password against hash
    const isValid = await compare(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      console.log(`Failed admin login from IP: ${clientIP} at ${new Date().toISOString()}`);
      
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.default.sign(
      { 
        admin: true, 
        loginTime: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60) // 2 hours
      },
      JWT_SECRET,
      { algorithm: 'HS256' }
    );

    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    console.log(`Successful admin login from IP: ${clientIP} at ${new Date().toISOString()}`);

    return res.status(200).json({ 
      success: true, 
      token,
      expiresIn: 2 * 60 * 60 // 2 hours in seconds
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
