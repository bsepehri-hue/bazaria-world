import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

console.log("🔥 FIREBASE ADMIN CHECK:");
console.log("- Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Loaded ✅" : "MISSING ❌");
console.log("- Client Email:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "Loaded ✅" : "MISSING ❌");
console.log("- Private Key:", process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "Loaded ✅" : "MISSING ❌");

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    // The .trim() completely removes the hidden trailing line breaks crashing OpenSSL
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/"/g, "").trim(),
  }),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

export const adminDb = getFirestore(app);
