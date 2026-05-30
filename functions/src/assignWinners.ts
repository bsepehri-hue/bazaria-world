import * as functions from "firebase-functions/v1"; // 👈 UPDATED TO FORCE V1 COMPATIBILITY MODE
import * as admin from "firebase-admin";

// Guard initialization to avoid double-init errors if app is already active
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const assignWinners = functions.pubsub
  .schedule("every 2 minutes")
  .onRun(async () => {
    const snap = await db
      .collection("auctions")
      .where("status", "==", "ended")
      .where("winnerAssigned", "==", false)
      .get();

    if (snap.empty) return null;

    const batch = db.batch();

    for (const doc of snap.docs) {
      const auction = doc.data();

      // If reserve not met → no winner
      if (!auction.reserveMet) {
        batch.update(doc.ref, {
          winnerAssigned: true,
          winnerId: null,
          finalPrice: null,
        });
        continue;
      }

      // Fetch highest bid
      const bidsSnap = await db
        .collection("auctions")
        .doc(doc.id)
        .collection("bids")
        .orderBy("amount", "desc")
        .limit(1)
        .get();

      if (bidsSnap.empty) {
        // No bids at all
        batch.update(doc.ref, {
          winnerAssigned: true,
          winnerId: null,
          finalPrice: null,
        });
        continue;
      }

      const highestBid = bidsSnap.docs[0].data();

      batch.update(doc.ref, {
        winnerAssigned: true,
        winnerId: highestBid.userId || null,
        finalPrice: highestBid.amount,
      });
    }

    await batch.commit();
    return null;
  });
