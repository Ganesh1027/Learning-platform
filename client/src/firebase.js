import { initializeApp, getApps } from "firebase/app";
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

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let analytics = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);

  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (err) {
  console.warn('Firebase initialization warning:', err);
}

export { app, auth, googleProvider, db, analytics };
export default app;
