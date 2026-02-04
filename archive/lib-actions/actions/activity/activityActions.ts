import { db } from '@/lib/firebase';

// 🔑 Log a new activity event
export async function logActivity(event: {
  type: string;
  stewardId: string;
  storefrontId?: string;
  saleId?: string;
  amount?: number;
  message: string;
}) {
  await db.collection('activity').add({
    ...event,
    timestamp: new Date(),
  });
}

// 🔑 Fetch recent activity for a steward
export async function getRecentActivity(stewardId: string, limit = 10) {
  const snap = await db
    .collection('activity')
    .where('stewardId', '==', stewardId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
