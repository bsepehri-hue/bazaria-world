"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { PrivacySettings } from "@/lib/settings/settings";
import { SettingsFormState } from "@/lib/settings/types";

export async function updatePrivacySettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    const userId = formData.get("userId") as string;

    const payload: PrivacySettings = {
      showActivityFeed: formData.has("showActivityFeed"),
      allowDirectMessages: formData.has("allowDirectMessages"),
      profileVisibility: formData.get("profileVisibility") as "public" | "private",
    };

    await updateDoc(doc(db, "users", userId, "settings", "privacy"), payload);

    return { success: true, message: "Privacy settings updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update privacy settings." };
  }
}
