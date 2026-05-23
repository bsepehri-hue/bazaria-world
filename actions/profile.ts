import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/lib/profile";

/**
 * 🛰️ FETCH DYNAMIC USER PROFILE
 * Bypasses hardcoded server mocks and reads active documents straight from Firestore
 */
export async function getProfile(userId: string): Promise<UserProfile> {
  try {
    // Look up the specific logged-in user in your Firestore database
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userId,
        displayName: data.displayName || "Active Bazaria User",
        email: data.email || "",
        walletAddress: data.walletAddress || "",
        bio: data.bio || "Welcome to my custom dashboard configuration.",
        storefrontId: data.storefrontId || null,
        twoFactorEnabled: data.twoFactorEnabled || false,
        joinDate: data.joinDate?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error executing server profile action fetch:", error);
  }

  // Fallback structural object if database match is loading or not found
  return {
    id: userId,
    displayName: "New User Workspace",
    email: "",
    walletAddress: "",
    bio: "Setting up your centralized platform connection...",
    joinDate: new Date(),
  };
}
