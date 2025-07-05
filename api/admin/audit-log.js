// Audit Log API endpoint for server-side logging
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
    const logEntry = req.body;
    
    // Add server-side information
    const serverLogEntry = {
      ...logEntry,
      serverTimestamp: new Date().toISOString(),
      clientIP: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    };

    // Log to server console (in production, save to database)
    console.log('AUDIT LOG:', JSON.stringify(serverLogEntry, null, 2));

    // In production, you would save to a database:
    // await saveToDatabase(serverLogEntry);

    return res.status(200).json({ success: true, logged: true });

  } catch (error) {
    console.error('Audit logging error:', error);
    return res.status(500).json({ error: 'Failed to log audit entry' });
  }
}
