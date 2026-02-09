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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { sendMessage } from "@/lib/messaging/sendMessage";
import { useTyping } from "../hooks/useTyping";


export default function SellerConversationPage() {
  const { threadId } = useParams() as { threadId: string };

  const { otherTyping, handleInput } = useTyping({
    threadId,
    role: "seller",
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");


  const bottomRef = useRef<HTMLDivElement | null>(null);

   const currentUserId = "seller"; // replace with auth user ID

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

 const [thread, setThread] = useState<any>(null);

useEffect(() => {
  const ref = doc(db, "threads", threadId);

  const unsub = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      setThread({ id: snap.id, ...snap.data() });
    }
  });

  const otherUserId = thread?.buyerId;

const { otherPresence } = usePresence({
  userId: currentUserId,
  otherUserId,
});

  return () => unsub();
}, [threadId]);

  
  useEffect(() => {
    const markRead = async () => {
      const threadRef = doc(db, "threads", threadId);

      await updateDoc(threadRef, {
        unreadForSeller: 0,
      });

      messages.forEach(async (msg) => {
        if (!msg.readBySeller) {
          const msgRef = doc(db, "messages", msg.id);
          await updateDoc(msgRef, { readBySeller: true });
        }
      });
    };

    if (messages.length > 0) markRead();
  }, [messages, threadId]);

const handleSend = async () => {
  if (!text.trim() || !thread) return;

  await sendMessage({
    threadId,
    senderId: currentUserId,
    text,
    buyerId: thread.buyerId,
    storeId: thread.storeId,
  });

  setText("");
};

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2 rounded-xl ${
              msg.senderId === currentUserId
                ? "bg-teal-600 text-white self-end"
                : "bg-white border text-gray-900 self-start"
            }`}
          >
            {msg.text}
            <div className="text-xs opacity-70 mt-1">
              {msg.createdAt?.toDate().toLocaleString()}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white p-4 flex items-center gap-3">
      {otherTyping && (
  <div className="text-sm text-gray-500 px-4 pb-2">Buyer is typing…</div>
)}

     <textarea
  value={text}
  onChange={(e) => {
    setText(e.target.value);
    handleInput();
  }}
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
