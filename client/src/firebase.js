import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// User Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe-m4HGjj5tQAI0DqoAFVbwzJrBeAoldM",
  authDomain: "learning-platform-fffa9.firebaseapp.com",
  projectId: "learning-platform-fffa9",
  storageBucket: "learning-platform-fffa9.firebasestorage.app",
  messagingSenderId: "883195778588",
  appId: "1:883195778588:web:3517e7d8faa158e807f1d9",
  measurementId: "G-5HXW0N5W1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
