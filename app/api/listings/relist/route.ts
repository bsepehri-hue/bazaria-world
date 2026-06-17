import { NextResponse, NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    // 1. ADD THIS: Check for the secret key header
    const secretKey = req.headers.get("x-api-key");
    if (secretKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { oldAssetId, durationDays } = await req.json();

    if (!oldAssetId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const oldDocRef = doc(db, "listings", oldAssetId);
    const oldDocSnap = await getDoc(oldDocRef);

    if (!oldDocSnap.exists()) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    const oldData = oldDocSnap.data() as any;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (durationDays || 7));

    // Clone listing
    const newDocRef = await addDoc(collection(db, "listings"), {
      ...oldData,
      currentBid: 0,
      bidCount: 0,
      bidders: [],
      status: "active",
      startTime: serverTimestamp(),
      endTime: futureDate.toISOString(),
      relistedFrom: oldAssetId
    });

    // Archive original
    await updateDoc(oldDocRef, {
      status: "archived",
      relistedTo: newDocRef.id,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ newAssetId: newDocRef.id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
