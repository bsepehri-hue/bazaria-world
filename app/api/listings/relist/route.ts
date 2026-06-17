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
    const { oldAssetId, durationDays } = await req.json();

    if (!oldAssetId) {
      return NextResponse.json({ error: "Missing original asset ID." }, { status: 400 });
    }

    // 1. FETCH THE OLD RECORD
    const oldDocRef = doc(db, "listings", oldAssetId);
    const oldDocSnap = await getDoc(oldDocRef);

    if (!oldDocSnap.exists()) {
      return NextResponse.json({ error: "Original asset listing not found." }, { status: 404 });
    }

    const oldData = oldDocSnap.data();

    // 2. PREPARE THE FRESH DUPLICATED PAYLOAD
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (durationDays || 7));

    const clonedPayload = {
      // Retain unchanged asset specs
      title: oldData.title,
      description: oldData.description,
      images: oldData.images || [],
      category: oldData.category,
      saleMode: oldData.saleMode,
      startingBid: oldData.startingBid,
      reservePrice: oldData.reservePrice,
      sellerId: oldData.sellerId,
      merchantId: oldData.merchantId || oldData.sellerId || "",
      isDigital: oldData.isDigital || false,
      
      // Reset variables for a fresh auction lifecycle
      currentBid: 0,
      bidCount: 0,
      bidders: [],
      status: "active",
      
      // Set the clean timeline
      startTime: serverTimestamp(),
      endTime: futureDate.toISOString(),
      
      // The Historical Anchor (Legal Audit Trail Link)
      relistedFrom: oldAssetId
    };

    // 3. WRITE THE NEW CLONED LISTING
    const listingsCollection = collection(db, "listings");
    const newDocRef = await addDoc(listingsCollection, clonedPayload);

    // 4. ARCHIVE THE OLD RECORD
    await updateDoc(oldDocRef, {
      status: "archived",
      relistedTo: newDocRef.id,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      success: true, 
      newAssetId: newDocRef.id 
    });

  } catch (error: any) {
    console.error("Server-side Relist Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
