import { useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, startAfter, limit, getDocs } from "firebase/firestore";

export function usePaginatedMessages(threadId: string | undefined) {
  const loadMore = useCallback(
    async ({ lastDoc, setMessages, setLastDoc, setHasMore, containerRef }) => {
      if (!threadId || !lastDoc) return;

      const container = containerRef.current;
      const prevHeight = container?.scrollHeight ?? 0;

      const q = query(
        collection(db, "messages"),
        where("threadId", "==", threadId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(20)
      );

      const snap = await getDocs(q);
      if (snap.empty) {
        setHasMore(false);
        return;
      }

      const older = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setMessages((prev) => [...older.reverse(), ...prev]);
      setLastDoc(snap.docs[snap.docs.length - 1]);

      requestAnimationFrame(() => {
        if (!container) return;
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - prevHeight;
      });
    },
    [threadId]
  );

  return { loadMore };
}
