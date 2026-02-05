"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";


export default function AdminDisputeApprovalPage() {
  const params = useParams<{ disputeId: string }>();

  if (!params) {
    return <p className="p-6 text-gray-600">Loading…</p>;
  }

  const { disputeId } = params;

  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "disputes", disputeId);
      const snap = await getDoc(ref);

      if (snap.exists()) setDispute(snap.data());
      setLoading(false);
    };

    load();
  }, [disputeId]);

  async function approveRefund() {
    if (!dispute) return;

    // 1. Reverse vault entry
    if (dispute.vaultEntryId) {
      await updateDoc(doc(db, "vault", dispute.vaultEntryId), {
        status: "reversed",
        updatedAt: serverTimestamp(),
      });
    }

    // 2. Reduce seller balance
    await updateDoc(doc(db, "balances", dispute.sellerId), {
      available: 0, // or subtract dispute.amount if tracking multiple entries
      updatedAt: serverTimestamp(),
    });

    // 3. Update PaymentIntent
    await updateDoc(doc(db, "paymentIntents", dispute.paymentIntentId), {
      status: "refunded",
      updatedAt: serverTimestamp(),
    });

    // 4. Create refund record
    await addDoc(collection(db, "refunds"), {
      paymentIntentId: dispute.paymentIntentId,
      vaultEntryId: dispute.vaultEntryId,
      sellerId: dispute.sellerId,
      buyerId: dispute.buyerId,
      amount: dispute.amount,
      status: "refunded",
      createdAt: serverTimestamp(),
    });

    // 5. Update dispute
    await updateDoc(doc(db, "disputes", disputeId as string), {
      status: "resolved_refunded",
      updatedAt: serverTimestamp(),
    });

    alert("Refund approved.");
  }

  async function rejectDispute() {
    await updateDoc(doc(db, "disputes", disputeId as string), {
      status: "resolved_rejected",
      updatedAt: serverTimestamp(),
    });

    alert("Dispute rejected.");
  }

  if (loading) return <p>Loading…</p>;
  if (!dispute) return <p>Not found.</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Review Dispute</h1>

      <div className="bg-white p-6 rounded shadow border space-y-3">
        <p>Buyer: {dispute.buyerId}</p>
        <p>Seller: {dispute.sellerId}</p>
        <p>Amount: ${dispute.amount}</p>
        <p>Reason: {dispute.reason}</p>
        <p>Description: {dispute.description}</p>
        <p>Status: {dispute.status}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={approveRefund}
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          Approve Refund
        </button>

        <button
          onClick={rejectDispute}
          className="bg-gray-900 text-white px-6 py-3 rounded"
        >
          Reject Dispute
        </button>
      </div>
    </div>
  );
}
