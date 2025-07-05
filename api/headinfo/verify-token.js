// Vercel Serverless Function for Token Verification
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;

    const { token } = req.body;
    const authHeader = req.headers.authorization;
    const tokenToVerify = token || (authHeader && authHeader.split(' ')[1]);

    if (!tokenToVerify) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.default.verify(tokenToVerify, JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(200).json({ 
      valid: true, 
      admin: decoded.admin,
      username: decoded.username || 'admin', // Fallback for backward compatibility
      expiresAt: decoded.exp * 1000 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
