import { db } from '@/lib/firebase';

// 🔑 Vault summary: balances + earnings
export async function getVaultSummary(stewardId: string) {
  const userDoc = await db.collection('users').doc(stewardId).get();
  if (!userDoc.exists) throw new Error('User not found');

  const stripeAccountId = userDoc.data().stripeAccountId;

  // Stripe balances
  const stripeBalance = await stripe.balance.retrieve({
    stripeAccount: stripeAccountId,
  });

  // Firestore earnings
  const lifetime = await getLifetimeEarnings(stewardId);
  const referrals = await getReferralEarnings(stewardId);
  const fees = await getPlatformFees(stewardId);

  return {
    available: stripeBalance.available[0]?.amount ?? 0,
    pending: stripeBalance.pending[0]?.amount ?? 0,
    lifetime,
    referrals,
    fees,
  };
}

// 🔑 Transaction ledger: recent sales/payouts
export async function getTransactionLedger(stewardId: string) {
  const snap = await db
    .collection('transactions')
    .where('stewardId', '==', stewardId)
    .orderBy('date', 'desc')
    .limit(10)
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// --- Helper functions ---
async function getLifetimeEarnings(stewardId: string) {
  const snap = await db.collection('sales').where('stewardId', '==', stewardId).get();
  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}

async function getReferralEarnings(stewardId: string) {
  const snap = await db.collection('referrals').where('referrerId', '==', stewardId).get();
  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}

async function getPlatformFees(stewardId: string) {
  const snap = await db.collection('fees').where('stewardId', '==', stewardId).get();
  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}
