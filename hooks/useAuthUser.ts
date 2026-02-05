import { app } from "@/lib/firebase/client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";


export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return user;
}
