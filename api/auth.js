// /api/auth.js

import ImageKit from "imagekit";

export default async function handler(req, res) {
  const {
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT,
  } = process.env;

  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    return res.status(500).json({ error: "Missing ImageKit environment variables" });
  }

  const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });

  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch (err) {
    console.error("ImageKit Auth Error:", err);
    res.status(500).json({ error: "Failed to generate auth params" });
  }
}
