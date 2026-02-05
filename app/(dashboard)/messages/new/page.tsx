"use client";


import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "../../../../hooks/useAuthUser";




export default function NewMessagePage() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAuthUser();


  const sellerId = params?.get("to") ?? null;

  useEffect(() => {
    const run = async () => {
      if (!user || !user.uid || !sellerId) return;   // ← FIXED

      const threadsRef = collection(db, "threads");
      const q = query(
        threadsRef,
        where("participants", "array-contains", user.uid)
      );

      const snap = await getDocs(q);

      let existingThread: string | null = null;

      snap.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(sellerId)) {
          existingThread = doc.id;
        }
      });

      if (existingThread) {
        router.replace(`/dashboard/messages/${existingThread}`);
        return;
      }

      const newThread = await addDoc(collection(db, "threads"), {
        participants: [user.uid, sellerId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
      });

      router.replace(`/dashboard/messages/${newThread.id}`);
    };

    run();
  }, [user, sellerId, router]);

  return (
    <p className="text-gray-600 p-6">
      Preparing your conversation…
    </p>
  );
}
