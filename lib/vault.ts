import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// 🔑 Vault summary: balances + earnings
export async function getVaultSummary(stewardId: string) {
  const userRef = doc(db, "users", stewardId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error("User not found");

  const data = userDoc.data();

  const lifetime = data.vault?.lifetime ?? 0;
  const referrals = data.vault?.referrals ?? 0;

  return {
    available: data.vault?.available ?? 0,
    pending: data.vault?.pending ?? 0,
    lifetime,
    referrals,
  };
}

// 🔑 Transaction ledger: recent sales/payouts
export async function getTransactionLedger(stewardId: string) {
  const q = query(
    collection(db, "transactions"),
    where("stewardId", "==", stewardId),
    orderBy("date", "desc"),
    limit(10)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// --- Helper functions ---
async function getLifetimeEarnings(stewardId: string) {
  const q = query(
    collection(db, "sales"),
    where("stewardId", "==", stewardId)
  );
  const snap = await getDocs(q);

  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}

async function getReferralEarnings(stewardId: string) {
  const q = query(
    collection(db, "referrals"),
    where("referrerId", "==", stewardId)
  );
  const snap = await getDocs(q);

  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}

async function getPlatformFees(stewardId: string) {
  const q = query(
    collection(db, "fees"),
    where("stewardId", "==", stewardId)
  );
  const snap = await getDocs(q);

  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}
