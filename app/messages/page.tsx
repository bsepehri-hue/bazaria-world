"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function BuyerInboxPage() {
  const user = useAuthUser();
  const router = useRouter();
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const ref = collection(db, "threads");
    const q = query(
      ref,
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
        <button
          key={t.id}
          onClick={() => router.push(`/messages/${t.id}`)}
          className="w-full text-left p-4 bg-white border rounded-xl"
        >
          <p className="font-semibold text-gray-900">{t.storeName}</p>
          <p className="text-sm text-gray-600">{t.listingTitle}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{t.lastMessage}</p>

          {t.unreadForBuyer > 0 && (
            <span className="inline-block mt-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
              {t.unreadForBuyer}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
