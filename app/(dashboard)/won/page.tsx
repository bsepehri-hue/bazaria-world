"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function WonAuctionsDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);

  // Load buyer's won auctions
  useEffect(() => {
    const ref = collection(db, "payouts");

    const q = query(
      ref,
      where("buyerId", "==", "demo-buyer"), // Replace with auth user ID
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const pendingList: any[] = [];
      const completedList: any[] = [];

      type WonItem = {
  id: string;
  status?: string;
};

snap.forEach((doc) => {
  const data = { ...(doc.data() as WonItem), id: doc.id };

  if (data.status === "awaiting-payment") pendingList.push(data);
  else completedList.push(data);
});

      setPending(pendingList);
      setCompleted(completedList);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="text-gray-600">Loading your won auctions…</p>;

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">Won Auctions</h1>

      {/* PENDING PAYMENT */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Awaiting Payment</h2>

        {pending.length === 0 ? (
          <p className="text-gray-600">No pending payments.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pending.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() =>
                  router.push(`/auctions/${p.category}/${p.auctionId}`)
                }
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.title}
                </h3>

                <p className="text-gray-800 font-medium">
                  Final Price: ${p.finalPrice}
                </p>

                <p className="text-sm text-gray-700">
                  Payment Deadline:{" "}
                  {p.paymentDeadline?.toDate
                    ? p.paymentDeadline.toDate().toLocaleString()
                    : "—"}
                </p>

                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMPLETED PAYMENTS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Completed</h2>

        {completed.length === 0 ? (
          <p className="text-gray-600">No completed purchases yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completed.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() =>
                  router.push(`/auctions/${p.category}/${p.auctionId}`)
                }
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.title}
                </h3>

                <p className="text-gray-800 font-medium">
                  Final Price: ${p.finalPrice}
                </p>

                <p className="text-sm text-gray-700">
                  Status: Paid
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
