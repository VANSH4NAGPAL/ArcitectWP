// Vercel Serverless Function for ImageKit Authentication
// This endpoint provides authentication tokens for ImageKit uploads

import crypto from 'crypto';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ImageKit private key from environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if (!privateKey) {
      console.error('IMAGEKIT_PRIVATE_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate authentication parameters
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
    
    // Create signature
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return res.status(200).json({
      token,
      expire,
      signature
    });

  } catch (error) {
    console.error('Error generating ImageKit auth:', error);
    return res.status(500).json({ error: 'Failed to generate authentication' });
  }
}
