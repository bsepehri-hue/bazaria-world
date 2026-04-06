import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 1. UPDATE THE PROJECT ID TO MATCH YOUR URL
  projectId: "listtobid-9ede2",
  
  // 2. UPDATE THE AUTH DOMAIN AND STORAGE BUCKET
  authDomain: "listtobid-9ede2.firebaseapp.com",
  storageBucket: "listtobid-9ede2.appspot.com",
  
  // 3. KEEP YOUR EXISTING API KEY (It usually works for the whole account)
  apiKey: "...", 
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase (Safely for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
