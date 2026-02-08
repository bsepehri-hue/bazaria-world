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
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";

function ConversationHeader({ thread, userId, presence }) {
  const isBuyer = thread.buyerId === userId;
  const title = isBuyer ? thread.storeName : thread.buyerName;
  

  const status = presence?.online
    ? presence?.away
      ? "Away"
      : "Online"
    : presence?.lastSeen
    ? `Last seen ${presence.lastSeen.toDate().toLocaleString()}`
    : "Offline";

  return (
    <div className="p-4 border-b bg-white">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{thread.listingTitle}</p>
      <p className="text-xs text-gray-500 mt-1">{status}</p>
    </div>
  );
}

export default function ConversationPage() {
  const { threadId } = useParams() as { threadId: string };
  const user = useAuthUser();

  const [messages, setMessages] = useState<any[]>([]);
  const [thread, setThread] = useState<any>(null);
  const [text, setText] = useState("");
  const [otherPresence, setOtherPresence] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [isTyping, setIsTyping] = useState(false);

  // Load thread
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
  if (!thread) return;

  const threadRef = doc(db, "threads", threadId);

  if (isTyping) {
    updateDoc(threadRef, { buyerTyping: true });
  } else {
    updateDoc(threadRef, { buyerTyping: false });
  }
}, [isTyping, thread, threadId]);
  
  // Load messages
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

useEffect(() => {
  if (!thread || !user?.uid) return;

  const field =
    thread.buyerId === user.uid ? "unreadForBuyer" : "unreadForSeller";

  updateDoc(doc(db, "threads", threadId), {
    [field]: 0
  });
}, [thread, user?.uid]);
  
  // Typing indicator
  useEffect(() => {
    if (!thread || !user?.uid) return;

    const isBuyer = thread.buyerId === user.uid;
    const isSeller = thread.sellerId === user.uid;

    const threadRef = doc(db, "threads", threadId);

    if (text.length > 0) {
      updateDoc(threadRef, {
        buyerTyping: isBuyer ? true : thread.buyerTyping,
        sellerTyping: isSeller ? true : thread.sellerTyping,
      });
    } else {
      updateDoc(threadRef, {
        buyerTyping: isBuyer ? false : thread.buyerTyping,
        sellerTyping: isSeller ? false : thread.sellerTyping,
      });
    }
  }, [text, thread, user?.uid]);

  // Presence: ensure doc exists + online/offline
  useEffect(() => {
    if (!user?.uid) return;

    const ref = doc(db, "presence", user.uid);

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
  }, [user?.uid]);

  // Presence: idle/away detection
  useEffect(() => {
    if (!user?.uid) return;

    const ref = doc(db, "presence", user.uid);

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
  }, [user?.uid]);

  // Presence: listen to other user
  useEffect(() => {
    if (!thread || !user?.uid) return;

    const otherId =
      user.uid === thread.buyerId ? thread.sellerId : thread.buyerId;

    const ref = doc(db, "presence", otherId);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setOtherPresence(snap.data());
      }
    });

    return () => unsub();
  }, [thread, user?.uid]);

  // Mark messages as read
  useEffect(() => {
    if (!thread || !user?.uid || messages.length === 0) return;

    const isBuyer = thread.buyerId === user.uid;
    const isSeller = thread.sellerId === user.uid;

    const unread = messages.filter(
      (m) =>
        m.senderId !== user.uid &&
        ((isBuyer && !m.readByBuyer) || (isSeller && !m.readBySeller))
    );

    if (unread.length === 0) return;

    unread.forEach((msg) => {
      const msgRef = doc(db, "messages", msg.id);
      updateDoc(msgRef, {
        readByBuyer: isBuyer ? true : msg.readByBuyer,
        readBySeller: isSeller ? true : msg.readBySeller,
      });
    });

    const threadRef = doc(db, "threads", threadId);
    updateDoc(threadRef, {
      unreadForBuyer: isBuyer ? 0 : thread.unreadForBuyer,
      unreadForSeller: isSeller ? 0 : thread.unreadForSeller,
      lastReadByBuyer: isBuyer ? serverTimestamp() : thread.lastReadByBuyer,
      lastReadBySeller: isSeller ? serverTimestamp() : thread.lastReadBySeller,
    });
  }, [messages, thread, user?.uid]);

  const handleSend = async () => {
    if (!text.trim() || !user?.uid || !thread) return;

    const messageText = text.trim();
    setText("");

    await addDoc(collection(db, "messages"), {
      threadId,
      senderId: user.uid,
      text: messageText,
      createdAt: serverTimestamp(),
      readByBuyer: user.uid === thread.buyerId,
      readBySeller: user.uid === thread.sellerId,
    });

    const threadRef = doc(db, "threads", threadId);
    const isBuyer = thread.buyerId === user.uid;

    await updateDoc(threadRef, {
      lastMessage: messageText,
      lastMessageAt: serverTimestamp(),
      unreadForBuyer: isBuyer ? 0 : (thread.unreadForBuyer || 0) + 1,
      unreadForSeller: isBuyer ? (thread.unreadForSeller || 0) + 1 : 0,
      lastReadByBuyer: isBuyer ? serverTimestamp() : thread.lastReadByBuyer,
      lastReadBySeller: isBuyer ? thread.lastReadBySeller : serverTimestamp(),
      buyerTyping: false,
      sellerTyping: false,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {thread && user?.uid && (
        <ConversationHeader
          thread={thread}
          userId={user.uid}
          presence={otherPresence}
        />
      )}

      {thread && (
        <div className="px-4 py-1 text-sm text-gray-500">
          {otherPresence?.online
            ? thread.buyerTyping && user.uid !== thread.buyerId
              ? "Typing…"
              : thread.sellerTyping && user.uid !== thread.sellerId
              ? "Typing…"
              : "Online"
            : otherPresence?.lastSeen
            ? `Last seen ${otherPresence.lastSeen
                .toDate()
                .toLocaleString()}`
            : "Offline"}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {thread?.sellerTyping && (
  <div className="text-sm text-gray-500 px-4 pb-2">Seller is typing…</div>
)}
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

              {isMine && (
                <div className="text-[10px] opacity-60 mt-1">
                  {msg.readByBuyer && msg.readBySeller
                    ? "Seen"
                    : msg.readByBuyer || msg.readBySeller
                    ? "Delivered"
                    : "Sent"}
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white p-4 flex items-center gap-3">

  <textarea
    value={text}
    onChange={(e) => {
      setText(e.target.value);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1200);
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
