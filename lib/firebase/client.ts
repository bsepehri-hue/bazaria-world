"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCJYKumffrnbNU_4F3ItEU3aHLe8UuGhbg",
  authDomain: "listtobid-9ede2.firebaseapp.com",
  projectId: "listtobid-9ede2",
  storageBucket: "listtobid-9ede2.firebasestorage.app",
  messagingSenderId: "482806996303",
  appId: "1:482806996303:web:2f9cbc2f5332b4a936f93a"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// 📡 SECURE CONTEXT-SAFE MESSAGING INITIALIZATION ENGINE
// This lets the agent UI hook into push registries dynamically on mobile devices 
// without breaking your Next.js pre-rendering processes during deployment.
export const getClientMessaging = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getMessaging(app);
  }
  return null;
};

export { app, auth, db, storage, googleProvider };
