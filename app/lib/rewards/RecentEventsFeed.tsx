"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type EventItem = {
  id: string;
  type: string;
  message: string;
  delta: number | null;
  timestamp: number;
};

export default function RecentEventsFeed({ userId }: { userId: string }) {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    if (!userId) return;

    const ref = collection(db, "rewardsEvents", userId, "events");
    const q = query(ref, orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const list: EventItem[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...(doc.data() as EventItem) });
      });
      setEvents(list);
    });

    return () => unsub();
  }, [userId]);

  if (events.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((e) => (
        <div
          key={e.id}
          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {e.message}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(e.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
