import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const logRewardEvent = functions.https.onCall(
  async (data, context) => {
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
