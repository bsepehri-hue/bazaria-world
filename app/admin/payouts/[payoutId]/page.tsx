"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AdminPayoutApprovalPage() {
  const params = useParams<{ payoutId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { payoutId } = params;
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [vaultEntries, setVaultEntries] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Load payout request
      const reqRef = doc(db, "payoutRequests", payoutId as string);
      const reqSnap = await getDoc(reqRef);

      if (!reqSnap.exists()) {
        setLoading(false);
        return;
      }

      const reqData = reqSnap.data();
      setRequest(reqData);

      // Load seller balance
      const balRef = doc(db, "balances", reqData.sellerId);
      const balSnap = await getDoc(balRef);
      if (balSnap.exists()) setBalance(balSnap.data());

      // Load available vault entries
      const q = query(
        collection(db, "vault"),
        where("sellerId", "==", reqData.sellerId),
        where("status", "==", "available")
      );

      const vaultSnap = await getDocs(q);
      const items: any[] = [];
      vaultSnap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setVaultEntries(items);

      setLoading(false);
    };

    loadData();
  }, [payoutId]);

  async function approvePayout() {
    if (!request) return;

    // 1. Create payout document
    const payoutRef = await addDoc(collection(db, "payouts"), {
  sellerId: request.sellerId,
  amount: request.amount,
  vaultEntries: vaultEntries.map((v) => v.id),
  requestId: payoutId,
  status: "paid",
  processor: "manual", // or "stripe" or "square" in the future
  createdAt: serverTimestamp(),
  processedAt: serverTimestamp(),
});

    // 2. Lock vault entries
    for (const v of vaultEntries) {
      await updateDoc(doc(db, "vault", v.id), {
        status: "locked",
        payoutId: payoutRef.id,
      });
    }

    // 3. Reduce seller balance
    await updateDoc(doc(db, "balances", request.sellerId), {
      available: balance.available - request.amount,
      updatedAt: serverTimestamp(),
    });

    // 4. Update payout request
    await updateDoc(doc(db, "payoutRequests", payoutId as string), {
      status: "approved",
      payoutId: payoutRef.id,
      updatedAt: serverTimestamp(),
    });

    alert("Payout approved.");
  }

  async function rejectPayout() {
    await updateDoc(doc(db, "payoutRequests", payoutId as string), {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });

    alert("Payout rejected.");
  }

  if (loading) return <p className="text-gray-600">Loading payout…</p>;
  if (!request) return <p className="text-gray-600">Payout request not found.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Review Payout Request
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <p className="text-gray-700">
          Seller: <span className="font-semibold">{request.sellerId}</span>
        </p>

        <p className="text-gray-700">
          Amount Requested:{" "}
          <span className="font-semibold">${request.amount}</span>
        </p>

        <p className="text-gray-700">
          Status:{" "}
          <span className="font-semibold capitalize">{request.status}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Seller Balance</h2>

        <p className="text-gray-700">
          Available:{" "}
          <span className="font-semibold">${balance?.available}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Vault Entries</h2>

        {vaultEntries.length === 0 ? (
          <p className="text-gray-600">No available vault entries.</p>
        ) : (
          vaultEntries.map((v) => (
            <p key={v.id} className="text-gray-700">
              Vault #{v.id} — ${v.amount}
            </p>
          ))
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={approvePayout}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg"
        >
          Approve
        </button>

        <button
          onClick={rejectPayout}
          className="bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
