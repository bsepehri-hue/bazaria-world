"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";

function ConversationHeader({ thread, userId }) {
  const isBuyer = thread.buyerId === userId;
  const title = isBuyer ? thread.storeName : thread.buyerName;

  return (
    <div className="p-4 border-b bg-white">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{thread.listingTitle}</p>
    </div>
  );
}

export default function ConversationPage() {
  const { threadId } = useParams() as { threadId: string };
  const user = useAuthUser();

  const [messages, setMessages] = useState<any[]>([]);
  const [thread, setThread] = useState<any>(null);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threadId) return;

    const ref = doc(db, "threads", threadId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setThread({ id: snap.id, ...snap.data() });
      }
    });

    return () => unsub();
  }, [threadId]);

  useEffect(() => {
    const ref = collection(db, "messages");
    const q = query(
      ref,
      where("threadId", "==", threadId),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setMessages(list);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    });

    return () => unsub();
  }, [threadId]);

  const handleSend = async () => {
    if (!text.trim() || !user?.uid) return;
    setText("");
  };

  return (
    <div className="flex flex-col h-full">

      {thread && user?.uid && (
        <ConversationHeader thread={thread} userId={user.uid} />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMine = msg.senderId === user?.uid;

          return (
            <div
              key={msg.id}
              className={`max-w-[75%] px-4 py-2 rounded-xl ${
                isMine
                  ? "bg-teal-600 text-white self-end"
                  : "bg-white border text-gray-900 self-start"
              }`}
            >
              {msg.text}
              <div className="text-xs opacity-70 mt-1">
                {msg.createdAt?.toDate().toLocaleString()}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white p-4 flex items-center gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 resize-none rounded-xl border px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
