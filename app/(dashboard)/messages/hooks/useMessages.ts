import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

export function useMessages(threadId: string | undefined) {
  const [messages, setMessages] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!threadId) return;

    const q = query(
      collection(db, "messages"),
      where("threadId", "==", threadId),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setMessages([]);
        setHasMore(false);
        setLastDoc(null);
        return;
      }

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list.reverse());
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(true);
    });

    return () => unsub();
  }, [threadId]);

  return { messages, setMessages, lastDoc, setLastDoc, hasMore, setHasMore };
}
