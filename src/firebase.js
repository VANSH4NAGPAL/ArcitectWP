// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI-dT2iJoQtW1hgXXXnbGsyXCYpLFmLpc",
  authDomain: "tudiodesignpalettefinal.firebaseapp.com",
  projectId: "tudiodesignpalettefinal",
  storageBucket: "tudiodesignpalettefinal.firebasestorage.app",
  messagingSenderId: "197324355476",
  appId: "1:197324355476:web:60bd2170aaf8ee59ae4181",
  measurementId: "G-42VSH1GKZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export const storage = getStorage(app);
export { db, analytics };