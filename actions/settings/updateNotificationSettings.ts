"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NotificationSettings } from "@/lib/settings/settings";
import { SettingsFormState } from "@/lib/settings/types";

export async function updateNotificationSettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    const userId = formData.get("userId") as string;

    const payload: NotificationSettings = {
      emailUpdates: formData.has("emailUpdates"),
      bidAlerts: formData.has("bidAlerts"),
      payoutAlerts: formData.has("payoutAlerts"),
      marketingEmails: formData.has("marketingEmails"),
    };

    await updateDoc(doc(db, "users", userId, "settings", "notifications"), payload);

    return { success: true, message: "Notification preferences updated." };
  } catch (error) {
    return { success: false, message: "Failed to update notification settings." };
  }
}
