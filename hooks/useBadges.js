import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../app/lib/firebase";
export function useBadges(userId) {
  const [badges, setBadges] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 🚫 Do not attach listener until userId is valid
    if (!userId) return;

    try {
      const ref = doc(db, "users", userId);

      const unsubscribe = onSnapshot(
        ref,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const badgeStates = data.badges || {};
            setBadges(badgeStates);

            const total = Object.keys(badgeStates).length;
            const completed = Object.values(badgeStates).filter(
              (state) => state === "emerald"
            ).length;

            setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
          }
        },
        (error) => {
          console.error("🔥 useBadges listener error:", error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("🔥 useBadges setup error:", err);
    }
  }, [userId]);

  return { badges, progress };
}
