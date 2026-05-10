import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const onSaleCreated = onDocumentCreated("sales/{saleId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const sale = snap.data() as {
    stewardId: string;
    merchantId: string;
    amount: number;
    referralFee?: number;
  };

  // Reference to merchant profile
  const userRef = db.collection("users").doc(sale.merchantId);

  // Flip storefront badge on first sale
  if (sale.amount > 0) {
    await userRef.update({
      "badges.storefront_activated": "emerald",
      "badges.finance_connected": "emerald"
    });
  }

  // Flip referral badge if referral fee present
  if (sale.referralFee && sale.referralFee > 0) {
    await userRef.update({
      "badges.auctionlink_connected": "emerald"
    });
  }
});
