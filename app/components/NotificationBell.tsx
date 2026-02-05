"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  // TEMP — replace with your auth user
  const userId = "TEMP_USER_ID";

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      setCount(snap.size);
    });

    return () => unsub();
  }, [userId]);

  return (
    <Link href="/dashboard/notifications" className="relative">
      {/* Bell Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-gray-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.857 17.657A2 2 0 0113 19H11a2 2 0 01-1.857-1.343M5 8a7 7 0 1114 0c0 3.866 1.343 6 3 6H2c1.657 0 3-2.134 3-6z"
        />
      </svg>

      {/* Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
