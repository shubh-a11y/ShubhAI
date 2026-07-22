
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shubhai-83abe.firebaseapp.com",
  projectId: "shubhai-83abe",
  storageBucket: "shubhai-83abe.firebasestorage.app",
  messagingSenderId: "927389536025",
  appId: "1:927389536025:web:373aae53bc7bb96043ff88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();



