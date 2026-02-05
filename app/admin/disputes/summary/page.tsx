"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";

export default function AdminDisputeSummaryDashboard() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<any[]>([]);

  const [openCount, setOpenCount] = useState(0);
  const [refundedCount, setRefundedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const [amountAtRisk, setAmountAtRisk] = useState(0);
  const [amountRefunded, setAmountRefunded] = useState(0);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "disputes"));
      const items: any[] = [];

      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

      setDisputes(items);

      // Compute metrics
      let open = 0;
      let refunded = 0;
      let rejected = 0;

      let risk = 0;
      let refundedAmount = 0;

      items.forEach((d) => {
        if (d.status === "open") {
          open++;
          risk += d.amount;
        }

        if (d.status === "resolved_refunded") {
          refunded++;
          refundedAmount += d.amount;
        }

        if (d.status === "resolved_rejected") {
          rejected++;
        }
      });

      setOpenCount(open);
      setRefundedCount(refunded);
      setRejectedCount(rejected);

      setAmountAtRisk(risk);
      setAmountRefunded(refundedAmount);

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p className="text-gray-600">Loading dispute summary…</p>;

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">Dispute Summary Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border space-y-2">
          <p className="text-gray-600">Open Disputes</p>
          <p className="text-3xl font-bold text-gray-900">{openCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border space-y-2">
          <p className="text-gray-600">Refunded</p>
          <p className="text-3xl font-bold text-emerald-700">{refundedCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border space-y-2">
          <p className="text-gray-600">Rejected</p>
          <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border space-y-2">
          <p className="text-gray-600">Total Amount at Risk</p>
          <p className="text-3xl font-bold text-red-600">${amountAtRisk}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border space-y-2">
          <p className="text-gray-600">Total Refunded</p>
          <p className="text-3xl font-bold text-emerald-700">${amountRefunded}</p>
        </div>
      </div>

      {/* Recent Disputes */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Disputes</h2>

        {disputes.length === 0 ? (
          <p className="text-gray-600">No disputes found.</p>
        ) : (
          disputes
            .sort((a, b) => {
              const t1 = a.createdAt?.toDate?.().getTime() || 0;
              const t2 = b.createdAt?.toDate?.().getTime() || 0;
              return t2 - t1;
            })
            .slice(0, 5)
            .map((d) => (
              <div key={d.id} className="border-b pb-4">
                <p className="text-gray-700">
                  Dispute #{d.id} — ${d.amount} —{" "}
                  <span className="font-semibold capitalize">{d.status}</span>
                </p>

                <p className="text-gray-600 text-sm">
                  Buyer: {d.buyerId} | Seller: {d.sellerId}
                </p>

                <Link
                  href={`/admin/disputes/${d.id}`}
                  className="inline-block mt-2 text-teal-600 font-medium"
                >
                  Review →
                </Link>
              </div>
            ))
        )}

        <Link
          href="/admin/disputes"
          className="inline-block bg-gray-900 text-white px-4 py-2 rounded mt-4"
        >
          View All Disputes
        </Link>
      </div>
    </div>
  );
}
