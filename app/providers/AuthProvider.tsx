"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useEffect, useState } from "react";

export default function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) return null; // or a loading spinner

  return children;
}
