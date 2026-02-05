import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CreatePaymentIntentParams {
  buyerId: string;
  sellerId: string;
  amount: number;
  platformFee: number;
  processingFee: number;
  referralFee?: number;
  shippingFee?: number;
  type: "listing" | "auction" | "service" | "storefront";
  contextId: string;
}

export async function createPaymentIntent({
  buyerId,
  sellerId,
  amount,
  platformFee,
  processingFee,
  referralFee = 0,
  shippingFee = 0,
  type,
  contextId,
}: CreatePaymentIntentParams) {
  const total = amount + platformFee + processingFee + shippingFee;

  const docRef = await addDoc(collection(db, "paymentIntents"), {
    buyerId,
    sellerId,

    amount,
    platformFee,
    processingFee,
    referralFee,
    shippingFee,
    total,

    type, // listing | auction | service | storefront
    contextId,

    status: "pending",
    paymentProcessor: "stripe",

    paymentIntentId: null,
    chargeId: null,

    vaultEntryId: null,
    payoutId: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}
