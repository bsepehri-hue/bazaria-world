import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

export function useTyping({
  threadId,
  role, // "buyer" or "seller"
}) {
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const fieldForSelf =
    role === "buyer" ? "buyerTyping" : "sellerTyping";

  const fieldForOther =
    role === "buyer" ? "sellerTyping" : "buyerTyping";

  const setTyping = (isTyping: boolean) => {
    const threadRef = doc(db, "threads", threadId);
    updateDoc(threadRef, { [fieldForSelf]: isTyping });
  };

  const handleInput = () => {
    setTyping(true);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      setTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (!threadId) return;

    const threadRef = doc(db, "threads", threadId);

    const unsub = onSnapshot(threadRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setOtherTyping(Boolean(data[fieldForOther]));
    });

    return () => unsub();
  }, [threadId, fieldForOther]);

  return { otherTyping, handleInput };
}
