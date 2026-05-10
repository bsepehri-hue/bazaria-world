"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const loadPayments = async () => {
      const snap = await getDocs(collection(db, "paymentIntents"));
      const items: any[] = [];

      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setPayments(items);
      setLoading(false);
    };

    loadPayments();
  }, []);

  if (loading) return <p className="text-gray-600">Loading payments…</p>;

  if (payments.length === 0)
    return <p className="text-gray-600">No payments found.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Payments Overview</h1>

      <div className="space-y-6">
        {payments.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-xl shadow border space-y-3"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Payment #{p.id}
            </h2>

            <p className="text-gray-700">
              Buyer: <span className="font-semibold">{p.buyerId}</span>
            </p>

            <p className="text-gray-700">
              Seller: <span className="font-semibold">{p.sellerId}</span>
            </p>

            <p className="text-gray-700">
              Type:{" "}
              <span className="font-semibold capitalize">{p.type}</span>
            </p>

            <p className="text-gray-700">
              Amount:{" "}
              <span className="font-semibold">${p.amount}</span>
            </p>

            <p className="text-gray-700">
              Total Charged:{" "}
              <span className="font-semibold">${p.total}</span>
            </p>

            <p className="text-gray-700">
              Status:{" "}
              <span className="font-semibold text-emerald-700">
                {p.status}
              </span>
            </p>

            <p className="text-gray-700">
              Vault Entry:{" "}
              <span className="font-semibold">
                {p.vaultEntryId || "—"}
              </span>
            </p>

            <p className="text-gray-700">
              Payout:{" "}
              <span className="font-semibold">
                {p.payoutId || "—"}
              </span>
            </p>

            <Link
              href={`/admin/payments/${p.id}`}
              className="inline-block bg-gray-900 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
