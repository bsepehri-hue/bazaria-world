"use client";

import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useEffect, useState, useRef } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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
  // your grouping logic
}

export default function RecentEventsFeed({ userId }: { userId: string }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // your Firestore subscription logic
  }, [userId]);

  const grouped = groupEventsByDay(events);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([label, items]) => (
        <div key={label} className="border rounded-lg p-4">
          <button
            className="flex justify-between w-full text-left font-semibold"
            onClick={() =>
              setOpen((prev) => ({ ...prev, [label]: !prev[label] }))
            }
          >
            <span>{label}</span>
            <span className={`chevron ${open[label] ? "rotate-180" : "rotate-0"}`}>
              ▾
            </span>
          </button>

          <div
            className="collapsible overflow-hidden transition-all"
            style={{
              maxHeight: open[label]
                ? `${contentRefs.current[label]?.scrollHeight || 0}px`
                : "0px",
            }}
          >
            <div
              ref={(el) => {
                contentRefs.current[label] = el;
              }}
              className="space-y-3 pt-1"
            >
              {items.map((e) => {
                const isNew = false; // your logic

                return (
                  <div
                    key={e.id}
                    className={`p-3 sm:p-4 rounded-lg border bg-white dark:bg-gray-900 shadow-sm ${
                      colorMap[e.type] ??
                      "border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {isNew && (
                      <div className="text-xs text-amber-600 font-semibold mb-1">
                        NEW
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>{iconMap[e.type] ?? "•"}</span>
                      <span>{e.message}</span>
                    </div>

                    <div className="text-xs opacity-70 mt-1">
                      {new Date(e.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
