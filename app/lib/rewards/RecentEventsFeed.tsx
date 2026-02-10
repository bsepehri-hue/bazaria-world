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

function groupEventsByDay(events: EventItem[]) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  const startOfYesterday = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  ).getTime();

  const groups: Record<string, EventItem[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
  };

  for (const e of events) {
    if (e.timestamp >= startOfToday) {
      groups.Today.push(e);
    } else if (e.timestamp >= startOfYesterday) {
      groups.Yesterday.push(e);
    } else if (e.timestamp >= startOfToday - 7 * 24 * 60 * 60 * 1000) {
      groups["Last 7 Days"].push(e);
    }
  }

  return groups;
}

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

  const groups = groupEventsByDay(events);

  const [open, setOpen] = useState<Record<string, boolean>>({
    Today: true,
    Yesterday: false,
    "Last 7 Days": false,
  });

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([label, items]) =>
        items.length === 0 ? null : (
          <div key={label}>
            <button
              onClick={() =>
                setOpen((prev) => ({ ...prev, [label]: !prev[label] }))
              }
              className="w-full text-left text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-between"
            >
              <span>{label}</span>
              <span>{open[label] ? "▾" : "▸"}</span>
            </button>

          <div
  className="collapsible"
  style={{
    maxHeight: open[label] ? `${items.length * 80}px` : "0px",
  }}
>
  <div className="space-y-3 pt-1">
    {items.map((e) => (
      <div
        key={e.id}
        className={`p-3 rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${
          colorMap[e.type] ?? "border-gray-300 dark:border-gray-700"
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{iconMap[e.type] ?? "•"}</span>
          <span>{e.message}</span>
        </div>

        <div className="text-xs opacity-70 mt-1">
          {new Date(e.timestamp).toLocaleString()}
        </div>
      </div>
    ))}
  </div>
</div>
          </div>
        )
      )}
    </div>
  );
}
