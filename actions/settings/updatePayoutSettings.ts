"use server";

import { db } from "@/lib/firebase/server";
import { doc, updateDoc } from "firebase/firestore";
import { PayoutSettings } from "@/lib/settings/settings";
import { SettingsFormState } from "@/lib/settings/types";

export async function updatePayoutSettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    const userId = formData.get("userId") as string;

   const payload: PayoutSettings = {
  preferredToken: formData.get("preferredToken") as string,
  frequency: formData.get("frequency") as "daily" | "weekly" | "monthly",
};

    await updateDoc(
  doc(db, "users", userId, "settings", "payouts"),
  { ...payload }
);

    return { success: true, message: "Payout settings updated." };
  } catch (error) {
    return { success: false, message: "Failed to update payout settings." };
  }
}
