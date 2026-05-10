import { db } from "@/lib/firebase/client";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

// Save a listing to favorites
export async function saveFavorite(uid: string, listingId: string) {
  const ref = doc(db, "users", uid, "favorites", listingId);
  await setDoc(ref, {
    listingId,
    savedAt: serverTimestamp(),
  });
}

// Remove a listing from favorites
export async function removeFavorite(uid: string, listingId: string) {
  const ref = doc(db, "users", uid, "favorites", listingId);
  await deleteDoc(ref);
}

// Toggle favorite state
export async function toggleFavorite(uid: string, listingId: string) {
  const ref = doc(db, "users", uid, "favorites", listingId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, {
      listingId,
      savedAt: serverTimestamp(),
    });
  }
}
