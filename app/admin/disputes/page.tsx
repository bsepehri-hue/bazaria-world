"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "disputes"));
      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setDisputes(items);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Disputes</h1>

      {disputes.map((d) => (
        <div key={d.id} className="bg-white p-6 rounded shadow border">
          <p>Buyer: {d.buyerId}</p>
          <p>Seller: {d.sellerId}</p>
          <p>Amount: ${d.amount}</p>
          <p>Status: {d.status}</p>

          <Link
            href={`/admin/disputes/${d.id}`}
            className="inline-block bg-gray-900 text-white px-4 py-2 rounded mt-3"
          >
            Review
          </Link>
        </div>
      ))}
    </div>
  );
}
