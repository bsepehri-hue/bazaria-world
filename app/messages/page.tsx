"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link";

export default function BuyerInbox() {
  const user = useAuthUser();
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "threads"),
      where("buyerId", "==", user.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setThreads(list);
    });

    return () => unsub();
  }, [user?.uid]);

  return (
    <div className="p-4 space-y-4">
      {threads.map((t) => (
        <Link
          key={t.id}
          href={`/messages/${t.id}`}
          className="block p-4 bg-white border rounded-xl"
        >
          <p className="font-semibold text-gray-900">{t.storeName}</p>
          <p className="text-sm text-gray-600">{t.listingTitle}</p>

          <p className="text-xs text-gray-500 mt-1 truncate">
            {t.lastMessage}
          </p>

          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>{t.lastMessageAt?.toDate().toLocaleString()}</span>
            {t.unreadForBuyer > 0 && (
              <span className="text-teal-600 font-semibold">
                {t.unreadForBuyer}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
