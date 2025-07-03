import axios from "axios";

const IMAGEKIT_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = import.meta.env.VITE_IMAGEKIT_PRIVATE_API;
const IMAGEKIT_FOLDER = "/projects"; // optional folder name in your ImageKit dashboard

/**
 * Uploads a file to ImageKit and returns the public URL.
 * @param {File} file - File object from input
 * @returns {Promise<string>} - Uploaded file URL
 */
export const uploadToImageKit = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_IMAGEKIT_UPLOAD_PRESET);
  formData.append("fileName", file.name);
  formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);

  const response = await fetch(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.url;
};
