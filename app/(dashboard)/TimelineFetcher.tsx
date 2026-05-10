"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import ActivityTimeline from "@/components/timeline/ActivityTimeline";
import type { TimelineEvent } from "@/app/types/timeline";

export default function TimelineFetcher() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "timeline"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: TimelineEvent[] = snapshot.docs.map((doc) => ({
  ...(doc.data() as TimelineEvent),
  id: doc.id,
}));

      setEvents(data);
    });

    return () => unsubscribe();
  }, []);

  return <ActivityTimeline timeline={events} />;
}
