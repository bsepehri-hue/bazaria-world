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
import { db } from '@/lib/firebase/client';

export default function SellerMessagesDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);
  const sellerId = "demo-seller"; // Replace with auth user ID

  useEffect(() => {
    const ref = collection(db, "threads");

    const q = query(
      ref,
      where("participants", "array-contains", sellerId),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setThreads(items);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="text-gray-600">Loading messages…</p>;

  const contextLabel = (type: string) => {
    switch (type) {
      case "listing":
        return "Listing";
      case "auction":
        return "Auction";
      case "service":
        return "Service";
      case "storefront":
        return "Storefront";
      default:
        return "Message";
    }
  };

  const unreadForSeller = (t: any) => {
    const isA = t.participants[0] === sellerId;
    return isA ? t.unreadCountForA : t.unreadCountForB;
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

      {threads.length === 0 ? (
        <p className="text-gray-600">No conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {threads.map((t) => {
            const unread = unreadForSeller(t);

            return (
              <div
                key={t.id}
                onClick={() => router.push(`/messages/${t.id}`)}
                className="bg-white border rounded-xl shadow p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  {/* Context Badge */}
                  <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded">
                    {contextLabel(t.contextType)}
                  </span>

                  {/* Timestamp */}
                  <span className="text-xs text-gray-500">
                    {t.lastMessageAt?.toDate
                      ? t.lastMessageAt.toDate().toLocaleString()
                      : "—"}
                  </span>
                </div>

                {/* Last Message */}
                <p className="mt-2 text-gray-800 font-medium truncate">
                  {t.lastMessage || "No messages yet"}
                </p>

                {/* Unread Badge */}
                {unread > 0 && (
                  <span className="inline-block mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                    {unread} unread
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
