// api/auth.js

// Required for using dotenv in local development
import dotenv from 'dotenv';
import ImageKit from 'imagekit';
import process from 'process';

// Load .env variables (only needed in local dev, Vercel handles this in prod)
dotenv.config();

// Validate environment variables
const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error("❌ Missing one or more ImageKit environment variables in .env");
}

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

// Default serverless function handler (Vercel-style or custom backend)
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const authParams = imagekit.getAuthenticationParameters();
      return res.status(200).json(authParams);
    } catch (error) {
      console.error("❌ Error generating ImageKit auth params:", error);
      return res.status(500).json({ error: "Failed to generate auth parameters" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
