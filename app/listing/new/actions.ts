"use server";

import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { redirect } from "next/navigation";

export async function createListing(data) {
  const docRef = await addDoc(collection(db, "listings"), {
    ...data,
    createdAt: Date.now(),
  });

  redirect(`/listing/${docRef.id}`);
}
