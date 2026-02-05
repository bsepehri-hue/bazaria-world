"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";

export default function AdminRefundDashboard() {
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<any[]>([]);

  useEffect(() => {
    const loadRefunds = async () => {
      const snap = await getDocs(collection(db, "refunds"));
      const items: any[] = [];

      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

      // Sort newest → oldest
      items.sort((a, b) => {
        const t1 = a.createdAt?.toDate?.().getTime() || 0;
        const t2 = b.createdAt?.toDate?.().getTime() || 0;
        return t2 - t1;
      });

      setRefunds(items);
      setLoading(false);
    };

    loadRefunds();
  }, []);

  if (loading) return <p className="text-gray-600">Loading refunds…</p>;

  if (refunds.length === 0)
    return <p className="text-gray-600">No refunds have been issued yet.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Refund Dashboard</h1>

      <div className="space-y-6">
        {refunds.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-xl shadow border space-y-3"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Refund #{r.id}
            </h2>

            <p className="text-gray-700">
              Amount Refunded:{" "}
              <span className="font-semibold">${r.amount}</span>
            </p>

            <p className="text-gray-700">
              Buyer:{" "}
              <span className="font-semibold">{r.buyerId}</span>
            </p>

            <p className="text-gray-700">
              Seller:{" "}
              <span className="font-semibold">{r.sellerId}</span>
            </p>

            <p className="text-gray-700">
              PaymentIntent:{" "}
              <span className="font-semibold">{r.paymentIntentId}</span>
            </p>

            <p className="text-gray-700">
              Vault Entry Reversed:{" "}
              <span className="font-semibold">{r.vaultEntryId || "—"}</span>
            </p>

            <p className="text-gray-700">
              Status:{" "}
              <span className="font-semibold capitalize">{r.status}</span>
            </p>

            <p className="text-gray-700">
              Processed:{" "}
              <span className="font-semibold">
                {r.createdAt?.toDate?.().toLocaleString() || "—"}
              </span>
            </p>

            <Link
              href={`/admin/payments/${r.paymentIntentId}`}
              className="inline-block bg-gray-900 text-white px-4 py-2 rounded"
            >
              View Payment
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
