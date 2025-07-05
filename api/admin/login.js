const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map();

// Clean up expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.firstAttempt > 15 * 60 * 1000) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

module.exports = async function handler(req, res) {
  // Environment variables
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  const JWT_SECRET = process.env.JWT_SECRET;
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const MAX_ATTEMPTS = 3;
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   '127.0.0.1';

  // Check rate limiting
  const now = Date.now();
  const rateLimitData = rateLimitStore.get(clientIP) || { attempts: 0, firstAttempt: now };
  
  // Reset if window expired
  if (now - rateLimitData.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitData.attempts = 0;
    rateLimitData.firstAttempt = now;
  }

  // Check if IP is blocked
  if (rateLimitData.attempts >= MAX_ATTEMPTS) {
    const timeRemaining = RATE_LIMIT_WINDOW - (now - rateLimitData.firstAttempt);
    return res.status(429).json({ 
      error: 'Too many attempts', 
      timeRemaining: Math.ceil(timeRemaining / 1000),
      blockedUntil: rateLimitData.firstAttempt + RATE_LIMIT_WINDOW
    });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Verify password against hash
    const isValid = await compare(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      // Record failed attempt
      rateLimitData.attempts += 1;
      rateLimitStore.set(clientIP, rateLimitData);

      // Log failed attempt for audit
      console.log(`Failed admin login attempt from IP: ${clientIP} at ${new Date().toISOString()}`);

      return res.status(401).json({ 
        error: 'Invalid password',
        attemptsRemaining: MAX_ATTEMPTS - rateLimitData.attempts
      });
    }

    // Clear rate limit on successful login
    rateLimitStore.delete(clientIP);

    // Generate JWT token
    const token = jwt.sign(
      { 
        admin: true, 
        ip: clientIP,
        loginTime: now,
        exp: Math.floor(now / 1000) + (2 * 60 * 60) // 2 hours
      },
      JWT_SECRET,
      { algorithm: 'HS256' }
    );

    // Log successful login for audit
    console.log(`Successful admin login from IP: ${clientIP} at ${new Date().toISOString()}`);

    // Set secure cookie
    res.setHeader('Set-Cookie', [
      `admin-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${2 * 60 * 60}; Path=/`,
      `admin-session=true; Secure; SameSite=Strict; Max-Age=${2 * 60 * 60}; Path=/`
    ]);

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
