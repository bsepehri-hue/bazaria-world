"use server";

import { db } from "@/lib/firebase/server";
import { doc, updateDoc } from "firebase/firestore";
import { UserProfile } from "@/lib/profile";

// Normal function (not a server action)
export async function getProfile(userId: string): Promise<UserProfile> {
  return {
    id: userId,
    displayName: "John Doe",
    email: "john@example.com",
    name: "John Doe",
    bio: "This is a sample bio.",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    avatarUrl: "",
    storefrontId: "store-001",
    joinDate: new Date(),
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  };
}

// Server action
export async function updateProfileDetails(prevState: any, formData: FormData) {
  try {
    const userId = formData.get("userId");
    const displayName = formData.get("displayName");
    const bio = formData.get("bio");

    if (!userId) {
      return { success: false, error: "Missing user ID" };
    }

    const ref = doc(db, "users", userId.toString());

    await updateDoc(ref, {
      displayName: displayName?.toString() || "",
      bio: bio?.toString() || "",
      updatedAt: Date.now(),
    });

    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to update profile",
    };
  }
}
