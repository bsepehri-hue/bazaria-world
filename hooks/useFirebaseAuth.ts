"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export function useFirebaseAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Prevent SSR crash
    if (typeof window === "undefined") return;

    // Prevent undefined auth crash
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return { user };
}
