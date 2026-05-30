import * as functions from "firebase-functions/v1"; // 👈 UPDATED TO FORCE V1 COMPATIBILITY MODE
import * as admin from "firebase-admin";

// Guard initialization to avoid double-init errors if app is already active
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const endAuctions = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    const now = Date.now();

    // Find auctions that should end
    const snap = await db
      .collection("auctions")
      .where("status", "==", "active")
      .where("endTime", "<=", now)
      .get();

    if (snap.empty) return null;

    const batch = db.batch();

    snap.forEach((doc) => {
      const data = doc.data();

      batch.update(doc.ref, {
        status: "ended",
        endedAt: admin.firestore.FieldValue.serverTimestamp(),
        reserveMet:
          data.reservePrice != null
            ? data.currentBid >= data.reservePrice
            : true,
      });
    });

    await batch.commit();

    return null;
  });
