import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/lib/profile";

export async function getProfile(userId: string): Promise<UserProfile> {
  try {
    // 🛰️ Pull the actual logged-in user profile from your Firestore 'users' collection
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userId,
        displayName: data.displayName || "Anonymous User",
        email: data.email || "",
        walletAddress: data.walletAddress || "",
        bio: data.bio || "No bio set yet.",
        storefrontId: data.storefrontId || null,
        twoFactorEnabled: data.twoFactorEnabled || false,
        joinDate: data.joinDate?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error fetching live database profile:", error);
  }

  // Fallback if document doesn't exist yet
  return {
    id: userId,
    displayName: "New User",
    email: "",
    walletAddress: "",
    bio: "Welcome to Bazaria!",
    joinDate: new Date(),
  };
}
