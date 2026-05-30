import * as functions from "firebase-functions/v1"; // 👈 FORCES STABLE V1 COMPATIBILITY MODE
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const logRewardEvent = functions.https.onCall(
  async (data, context) => {
    // 💡 FIXED: In v1, fields are destructured directly from the 'data' parameter argument!
    const { userId, type, message, delta } = data;

    if (!userId || !type || !message) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields"
      );
    }

    await db
      .collection("rewardsEvents")
      .doc(userId)
      .collection("events")
      .add({
        type,
        message,
        delta: delta ?? null,
        timestamp: Date.now(),
      });

    return { ok: true };
  }
);
