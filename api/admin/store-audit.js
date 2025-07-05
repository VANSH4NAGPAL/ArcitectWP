// Persistent Audit Log Storage
// Stores audit logs in Firebase Firestore for production monitoring

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

  try {
    const { action, details, userAgent, timestamp } = req.body;

    // Get client IP
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress;

    // Create audit log entry
    const auditEntry = {
      action,
      details,
      userAgent,
      ip: clientIp,
      timestamp: timestamp || new Date().toISOString(),
      serverTimestamp: new Date().toISOString()
    };

    // Try to store in Firebase Firestore if configured
    if (process.env.FIREBASE_PROJECT_ID) {
      try {
        // Import Firebase Admin SDK
        const { initializeApp, getApps } = await import('firebase-admin/app');
        const { getFirestore } = await import('firebase-admin/firestore');

        // Initialize Firebase Admin if not already initialized
        if (getApps().length === 0) {
          initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID,
          });
        }

        const db = getFirestore();
        
        // Store in audit_logs collection
        await db.collection('audit_logs').add(auditEntry);

        return res.status(200).json({ 
          success: true, 
          message: 'Audit log stored successfully',
          logId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });

      } catch (firebaseError) {
        console.error('Firebase audit log failed:', firebaseError);
        // Fall through to console logging
      }
    }

    // Fallback: Enhanced console logging with structured format
    console.log('🔒 SECURITY AUDIT LOG:', JSON.stringify({
      ...auditEntry,
      level: 'SECURITY',
      service: 'ArchitectWP-Admin'
    }, null, 2));

    // For production monitoring, you could also send to external logging service
    // Example: DataDog, LogRocket, Sentry, etc.
    if (process.env.AUDIT_WEBHOOK_URL) {
      try {
        await fetch(process.env.AUDIT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(auditEntry)
        });
      } catch (webhookError) {
        console.error('Audit webhook failed:', webhookError);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Audit log recorded',
      storage: 'console'
    });

  } catch (error) {
    console.error('Audit logging error:', error);
    return res.status(500).json({ error: 'Failed to store audit log' });
  }
}
