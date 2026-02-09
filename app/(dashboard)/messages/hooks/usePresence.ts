import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { doc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

export function usePresence({
  userId,
  otherUserId,
}: {
  userId: string | undefined;
  otherUserId: string | undefined;
}) {
  const [otherPresence, setOtherPresence] = useState<any>(null);

  // ensure presence doc exists + online/offline
  useEffect(() => {
    if (!userId) return;

    const ref = doc(db, "presence", userId);

    updateDoc(ref, {
      online: true,
      away: false,
      lastSeen: serverTimestamp(),
    }).catch(async () => {
      await setDoc(ref, {
        online: true,
        away: false,
        lastSeen: serverTimestamp(),
      });
    });

    const off = () =>
      updateDoc(ref, {
        online: false,
        away: false,
        lastSeen: serverTimestamp(),
      });

    window.addEventListener("beforeunload", off);
    return () => {
      off();
      window.removeEventListener("beforeunload", off);
    };
  }, [userId]);

  // idle/away detection
  useEffect(() => {
    if (!userId) return;

    const ref = doc(db, "presence", userId);

    let timeout: any;

    const markAway = () => {
      updateDoc(ref, {
        away: true,
        lastSeen: serverTimestamp(),
      });
    };

    const markActive = () => {
      updateDoc(ref, {
        online: true,
        away: false,
        lastSeen: serverTimestamp(),
      });

      clearTimeout(timeout);
      timeout = setTimeout(markAway, 2 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, markActive));

    markActive();

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive));
      clearTimeout(timeout);
    };
  }, [userId]);

  // listen to other user's presence
  useEffect(() => {
    if (!otherUserId) return;

    const ref = doc(db, "presence", otherUserId);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setOtherPresence(snap.data());
      }
    });

    return () => unsub();
  }, [otherUserId]);

  return { otherPresence };
}
