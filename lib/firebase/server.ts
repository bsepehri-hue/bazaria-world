// lib/firebase/server.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase/firestore"; // Ensure this import is compatible

// If you really want to avoid Admin SDK, stick to this:
import { initializeApp, getApps } from "firebase/app";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Next.js server-side check
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
