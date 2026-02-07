"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function SellerInboxPage() {
  const currentStoreId = "store123"; // replace with seller's store ID

  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    const ref = collection(db, "threads");
    const q = query(
      ref,
      where("storeId", "==", currentStoreId),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setThreads(list);
    });

    return () => unsub();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {threads.map((t) => (
        <Link
          key={t.id}
          href={`/dashboard/messages/${t.id}`}
          className="flex items-center justify-between p-4 bg-white border rounded-xl"
        >
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{t.buyerName}</span>
            <span className="text-sm text-gray-600">{t.listingTitle}</span>
            <span className="text-sm text-gray-500 mt-1 line-clamp-1">
              {t.lastMessage}
            </span>
          </div>

          {t.unreadForSeller > 0 && (
            <span className="ml-3 bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
              {t.unreadForSeller}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
