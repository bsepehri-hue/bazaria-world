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
import { useAuthUser } from "@/hooks/useAuthUser";   // ⭐ correct import

type AuctionDoc = {
  id: string;
  status?: string;
  [key: string]: any;
};

export default function SellerAuctionDashboard() {
  const router = useRouter();
  const user = useAuthUser();   // ⭐ correct usage

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any[]>([]);
  const [ended, setEnded] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  // ⭐ Live countdown ticker
 useEffect(() => {
  if (!user) return; // Prevents undefined queries

  const ref = collection(db, "auctions");

  const q = query(
    ref,
    where("sellerId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(q, (snap) => {
    const activeList: any[] = [];
    const endedList: any[] = [];

    snap.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };
      if (data.status === "active") activeList.push(data);
      else endedList.push(data);
    });

    setActive(activeList);
    setEnded(endedList);
    setLoading(false);
  });

  return () => unsub();
}, [user]);

  // ⭐ NOW your component body resumes cleanly
  if (loading) {
    return <p className="text-gray-600">Loading your auctions…</p>;
  }

  // ⭐ MAIN RETURN
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">Your Auctions</h1>

      {/* ACTIVE */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Active</h2>

        {active.length === 0 ? (
          <p className="text-gray-600">You have no active auctions.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {active.map((a) => (
              <div
                key={a.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() => router.push(`/auctions/${a.category}/${a.id}`)}
              >
                {/* Thumbnail */}
                {a.imageUrls?.length > 0 ? (
                  <img
                    src={a.imageUrls[0]}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900">
                  {a.title}
                </h3>

                <p className="text-gray-800 font-medium">
                  Current Bid: ${a.currentBid}
                </p>

                <p className="text-gray-600 text-sm">{a.bidCount} bids</p>

                <p className="text-sm font-semibold text-teal-700">
                  {formatTimeLeft(a.endTime)}
                </p>

                <p
                  className={`text-xs font-medium ${
                    a.reserveMet ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {a.reserveMet ? "Reserve Met" : "Reserve Not Met"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ENDED */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Ended</h2>

        {ended.length === 0 ? (
          <p className="text-gray-600">No ended auctions yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ended.map((a) => (
              <div
                key={a.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() => router.push(`/auctions/${a.category}/${a.id}`)}
              >
                {/* Thumbnail */}
                {a.imageUrls?.length > 0 ? (
                  <img
                    src={a.imageUrls[0]}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900">
                  {a.title}
                </h3>

                <p className="text-gray-800 font-medium">
                  Final Bid: ${a.currentBid}
                </p>

                <p className="text-gray-600 text-sm">{a.bidCount} bids</p>

                <p
                  className={`text-xs font-medium ${
                    a.reserveMet ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {a.reserveMet ? "Reserve Met" : "Reserve Not Met"}
                </p>

                <p className="text-sm text-gray-700">
                  Status: {a.status === "ended" ? "Ended" : a.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
