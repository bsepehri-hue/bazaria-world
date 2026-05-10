"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  arrayRemove,
  serverTimestamp 
} from "firebase/firestore";
import { app } from "@/lib/firebase/client";
import { Send, MessageSquare, Tag, User, ShieldAlert, ArrowLeft } from "lucide-react";

interface ChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  buyerId: string;
  sellerId: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: any;
  unreadBy: string[];
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

export default function InboxPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 1. Authenticate User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // 2. Stream Chat Threads where user is a participant
  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedThreads: ChatThread[] = [];
      snapshot.forEach((docSnap) => {
        fetchedThreads.push({ id: docSnap.id, ...docSnap.data() } as ChatThread);
      });
      setThreads(fetchedThreads);
      setLoading(false);
    }, (error) => {
      console.error("Error streaming chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, db]);

  // 3. Stream Messages for the Active Thread
  useEffect(() => {
    if (!activeThread) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, "chats", activeThread.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((docSnap) => {
        fetchedMessages.push({ id: docSnap.id, ...docSnap.data() } as Message);
      });
      setMessages(fetchedMessages);
      
      // Auto Scroll to Bottom on new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    // Mark messages as read for current user
    if (activeThread.unreadBy?.includes(currentUser?.uid)) {
      const threadDocRef = doc(db, "chats", activeThread.id);
      updateDoc(threadDocRef, {
        unreadBy: arrayRemove(currentUser.uid)
      });
    }

    return () => unsubscribe();
  }, [activeThread, currentUser, db]);

  // 4. Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeThread || !currentUser) return;

    const messageText = newMessageText.trim();
    setNewMessageText(""); // Clear input quickly

    try {
      // Add message to subcollection
      const messagesRef = collection(db, "chats", activeThread.id, "messages");
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: messageText,
        timestamp: serverTimestamp()
      });

      // Update thread lastMessage and unread flag for recipient
      const recipientId = activeThread.participants.find(id => id !== currentUser.uid) || "";
      const threadDocRef = doc(db, "chats", activeThread.id);
      await updateDoc(threadDocRef, {
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
        unreadBy: [recipientId] // Mark unread for the other person
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh", backgroundColor: "#05292E", color: "#ffffff",
        display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px", fontWeight: 700
      }}>
        Initializing Secure Mailbox...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{
        height: "100vh", backgroundColor: "#05292E", color: "#ffffff",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "16px"
      }}>
        <ShieldAlert size={48} color="#FFBF00" />
        <p style={{ fontWeight: 700 }}>Authentication Required</p>
        <a href="/login" style={{ color: "#FFBF00", textDecoration: "underline", fontWeight: 800 }}>Return to Login</a>
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh",
      backgroundColor: "#05292E",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      
      {/* 📥 TOP HEADER */}
      <div style={{
        padding: "20px 32px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#042226"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="/market" style={{ color: "#ffffff", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={20} />
          </a>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", margin: 0, letterSpacing: "-0.5px" }}>
              Secure Communication
            </h1>
            <span style={{ fontSize: "9px", fontWeight: 800, color: "#FFBF00", textTransform: "uppercase", letterSpacing: "1px" }}>
              Encrypted Buyer-Seller Protocol
            </span>
          </div>
        </div>
      </div>

      {/* 💼 CONTAINER SPLIT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* 📋 LEFT SIDEBAR: THREADS */}
        <div style={{
          width: "350px",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#042428",
          overflowY: "auto"
        }}>
          {threads.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              flex: 1, padding: "32px", textAlign: "center", color: "#64748b"
            }}>
              <MessageSquare size={32} style={{ marginBottom: "12px", opacity: 0.5 }} />
              <p style={{ fontSize: "12px", fontWeight: 700, margin: 0 }}>No conversations found yet.</p>
            </div>
          ) : (
            threads.map((thread) => {
              const isUnread = thread.unreadBy?.includes(currentUser.uid);
              const isActive = activeThread?.id === thread.id;

              return (
                <div 
                  key={thread.id}
                  onClick={() => setActiveThread(thread)}
                  style={{
                    padding: "20px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    cursor: "pointer",
                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.05)" : isUnread ? "rgba(255, 191, 0, 0.03)" : "transparent",
                    transition: "all 0.1s ease",
                    display: "flex",
                    gap: "12px",
                    position: "relative"
                  }}
                >
                  {isUnread && (
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444",
                      position: "absolute", left: "8px", top: "26px"
                    }} />
                  )}

                  {/* Thumbnail / Placeholder */}
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden"
                  }}>
                    {thread.listingImage ? (
                      <img src={thread.listingImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Tag size={18} color="#FFBF00" />
                    )}
                  </div>

                  {/* Text previews */}
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <h4 style={{ 
                      fontSize: "13px", fontWeight: 800, margin: "0 0 4px 0", color: "#ffffff",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}>
                      {thread.listingTitle}
                    </h4>
                    <p style={{ 
                      fontSize: "11px", color: isUnread ? "#ffffff" : "#94a3b8", margin: 0,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      fontWeight: isUnread ? 700 : 400
                    }}>
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 💬 RIGHT SIDEBAR: ACTIVE CONVERSATION WINDOW */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff", // Pure white chat canvas
          color: "#0f172a" // Slate-charcoal default text
        }}>
          {activeThread ? (
            <>
              {/* Active Header Info */}
              <div style={{
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc", // Very soft grey header background
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#05292E",
                  display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <Tag size={16} color="#FFBF00" />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 1000, margin: "0 0 2px 0", color: "#05292E" }}>{activeThread.listingTitle}</h3>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>
                    ID: {activeThread.listingId}
                  </span>
                </div>
              </div>

              {/* Message History area */}
              <div style={{
                flex: 1,
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                backgroundColor: "#ffffff" // Ensuring pure white canvas behind messages
              }}>
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.uid;
                  return (
                    <div 
                      key={msg.id}
                      style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        padding: "14px 18px",
                        borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                        // Gold bubble for outgoing, light charcoal grey for incoming
                        backgroundColor: isMe ? "#FFBF00" : "#f1f5f9", 
                        color: isMe ? "#05292E" : "#334155",
                        border: isMe ? "none" : "1px solid #e2e8f0",
                        fontSize: "13px",
                        fontWeight: isMe ? 800 : 600,
                        lineHeight: "1.5",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form 
                onSubmit={handleSendMessage}
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  gap: "12px",
                  backgroundColor: "#f8fafc" // Soft grey footer input frame
                }}
              >
                <input 
                  type="text"
                  placeholder="Type your message securely..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "30px",
                    padding: "16px 24px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
               <button 
                  type="submit"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#05292E", // Sleek dark teal/black background
                    color: "#FFBF00",          // Glowing gold arrow
                    border: "1px solid #FFBF00", // Subtle gold border boundary
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(5, 41, 46, 0.2)",
                    transition: "all 0.1s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#0b3d44"; // Slight hover highlight
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#05292E";
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              flex: 1, color: "#94a3b8", backgroundColor: "#ffffff"
            }}>
              <MessageSquare size={48} style={{ marginBottom: "16px", opacity: 0.4, color: "#cbd5e1" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 900, color: "#64748b", margin: 0 }}>
                No Thread Selected
              </h3>
              <p style={{ fontSize: "11px", margin: "4px 0 0 0", color: "#94a3b8" }}>Choose a conversation from the sidebar to view details.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
