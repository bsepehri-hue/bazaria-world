"use server";

import { db } from "@/lib/firebase/server";
import { doc, updateDoc } from "firebase/firestore";
import { AccountSettings } from "@/lib/settings/settings";
import { SettingsFormState } from "@/lib/settings/types";

export async function updateAccountSettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    const userId = formData.get("userId") as string;

    const payload: AccountSettings = {
      displayName: formData.get("displayName") as string,
      bio: formData.get("bio") as string,
      language: formData.get("language") as "en" | "es" | "fr",
    };

    await updateDoc(
  doc(db, "users", userId, "settings", "account"),
  payload as any
);



    return { success: true, message: "Account settings updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update account settings." };
  }
}
