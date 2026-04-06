import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These are your public keys from the Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bazaria-world.firebaseapp.com",
  projectId: "bazaria-world",
  storageBucket: "bazaria-world.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (Prevents multiple instances during hot-reloads)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
