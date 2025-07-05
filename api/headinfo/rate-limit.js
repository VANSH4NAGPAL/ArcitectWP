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
            attempts: attempts,
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
            attempts: attempts,
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
      // Fallback to in-memory rate limiting when Redis is not available
      // Note: This will only work for single instance deployments
      if (!globalThis.rateLimitStore) {
        globalThis.rateLimitStore = new Map();
      }

      if (req.method === 'POST') {
        const { action } = req.body;
        const key = `rate_limit:${clientIp}`;
        const now = Date.now();

        if (action === 'check') {
          const record = globalThis.rateLimitStore.get(key);
          if (record && record.attempts >= 3) {
            const remainingTime = Math.max(0, Math.ceil((record.expiresAt - now) / 1000));
            if (remainingTime > 0) {
              return res.status(429).json({
                blocked: true,
                remainingTime: remainingTime,
                message: `IP blocked. Try again in ${Math.ceil(remainingTime/60)} minutes`
              });
            } else {
              // Expired, remove the record
              globalThis.rateLimitStore.delete(key);
            }
          }

          return res.status(200).json({
            blocked: false,
            attempts: record ? record.attempts : 0,
            remainingAttempts: record ? Math.max(0, 3 - record.attempts) : 3
          });

        } else if (action === 'record_failed') {
          const record = globalThis.rateLimitStore.get(key) || { attempts: 0, expiresAt: 0 };
          record.attempts += 1;
          record.expiresAt = now + (15 * 60 * 1000); // 15 minutes
          globalThis.rateLimitStore.set(key, record);

          return res.status(200).json({
            blocked: record.attempts >= 3,
            attempts: record.attempts,
            remainingAttempts: Math.max(0, 3 - record.attempts)
          });

        } else if (action === 'clear') {
          globalThis.rateLimitStore.delete(key);
          return res.status(200).json({
            blocked: false,
            attempts: 0,
            message: 'Rate limit cleared'
          });
        }
      }

      return res.status(200).json({
        blocked: false,
        attempts: 0,
        message: 'Redis not configured - using in-memory rate limiting'
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
