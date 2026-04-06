import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...", // Get this from Firebase Project Settings -> General
  authDomain: "listtobid-portal.firebaseapp.com",
  projectId: "listtobid-portal",
  storageBucket: "listtobid-portal.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase (Safely for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
