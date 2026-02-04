'use server';

import { db } from '@/lib/db';
import { doc, updateDoc } from 'firebase/firestore';

export async function markOrderAsShipped(prevState, formData) {
  try {
    const orderId = formData.get('orderId');

    if (!orderId) {
      return { success: false, error: 'Missing order ID' };
    }

    const ref = doc(db, 'orders', orderId);

    await updateDoc(ref, {
      shippingStatus: 'shipped',
      shippedAt: Date.now(),
    });

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err?.message || 'Failed to update order',
    };
  }
}

