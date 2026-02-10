"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const colorMap: Record<string, string> = {
  trust: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  penalty: "border-red-600 text-red-700 dark:text-red-400",
  cooldown: "border-amber-600 text-amber-700 dark:text-amber-400",
  tier: "border-teal-600 text-teal-700 dark:text-teal-400",
};

const iconMap: Record<string, string> = {
  trust: "⭐",
  penalty: "⚠️",
  cooldown: "⏳",
  tier: "🎖️",
};

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
          className={`p-3 rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${
            colorMap[e.type] ?? "border-gray-300 dark:border-gray-700"
          }`}
        >
          <div className="text-sm font-medium">{e.message}</div>
          <div className="text-xs opacity-70 mt-1">
            {new Date(e.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
