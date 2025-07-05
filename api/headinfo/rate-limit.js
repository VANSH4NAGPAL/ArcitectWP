// Enhanced Rate Limiting with Redis support
// This replaces device-only lockout with IP-based blocking

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress;

  try {
    // If Redis is available, use distributed rate limiting
    if (process.env.REDIS_URL) {
      const { createClient } = await import('redis');
      const redis = createClient({ url: process.env.REDIS_URL });
      await redis.connect();

      if (req.method === 'POST') {
        const { action } = req.body;

        if (action === 'check') {
          const key = `rate_limit:${clientIp}`;
          const attempts = parseInt(await redis.get(key) || '0');
          const ttl = await redis.ttl(key);

          if (attempts >= 3) {
            await redis.disconnect();
            return res.status(429).json({
              blocked: true,
              remainingTime: ttl > 0 ? ttl : 0,
              message: `IP blocked. Try again in ${Math.ceil(ttl/60)} minutes`
            });
          }

          await redis.disconnect();
          return res.status(200).json({
            blocked: false,
            attempts,
            remainingAttempts: 3 - attempts
          });

        } else if (action === 'record_failed') {
          const key = `rate_limit:${clientIp}`;
          const attempts = await redis.incr(key);
          
          if (attempts === 1) {
            await redis.expire(key, 900); // 15 minutes
          }

          await redis.disconnect();
          return res.status(200).json({
            blocked: attempts >= 3,
            attempts,
            remainingAttempts: Math.max(0, 3 - attempts)
          });

        } else if (action === 'clear') {
          const key = `rate_limit:${clientIp}`;
          await redis.del(key);
          await redis.disconnect();
          
          return res.status(200).json({
            blocked: false,
            attempts: 0,
            message: 'Rate limit cleared'
          });
        }
      }

      await redis.disconnect();
    } else {
      // Fallback to basic response when Redis is not available
      return res.status(200).json({
        blocked: false,
        attempts: 0,
        message: 'Redis not configured - using client-side rate limiting'
      });
    }

  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fallback to allowing request if rate limiting fails
    return res.status(200).json({
      blocked: false,
      attempts: 0,
      message: 'Rate limiting temporarily unavailable'
    });
  }

  return res.status(400).json({ error: 'Invalid request' });
}
