"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import ActivityTimeline from "./ActivityTimeline";

const COLLECTIONS = [
  "sales",
  "payouts",
  "refunds",
  "messages",
  "storefrontEvents",
  "auctionEvents",
  "systemEvents",
];

export function useTimeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribers = [];

    COLLECTIONS.forEach((col) => {
      const q = query(
        collection(db, col),
        orderBy("timestamp", "desc"),
        limit(50)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          source: col,
          ...doc.data(),
        }));

        setEvents((prev) => {
          const merged = [
            ...prev.filter((e) => e.source !== col),
            ...data,
          ];

          merged.sort((a, b) => b.timestamp - a.timestamp);

          return merged;
        });
      });

      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  return events;
}
