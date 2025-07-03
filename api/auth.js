// api/auth.js
import ImageKit from "imagekit";

export default function handler(req, res) {
  // Set CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
    
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
      console.error("Missing ImageKit environment variables:", {
        hasPublic: !!IMAGEKIT_PUBLIC_KEY,
        hasPrivate: !!IMAGEKIT_PRIVATE_KEY,
        hasEndpoint: !!IMAGEKIT_URL_ENDPOINT
      });
      return res.status(500).json({ error: "Missing ImageKit environment variables" });
    }

    const imagekit = new ImageKit({ 
      publicKey: IMAGEKIT_PUBLIC_KEY, 
      privateKey: IMAGEKIT_PRIVATE_KEY, 
      urlEndpoint: IMAGEKIT_URL_ENDPOINT 
    });

    const authParams = imagekit.getAuthenticationParameters();
    
    return res.status(200).json(authParams);
  } catch (err) {
    console.error("Server-side ImageKit error:", err);
    return res.status(500).json({ error: "Failed to generate auth parameters", details: err.message });
  }
}
