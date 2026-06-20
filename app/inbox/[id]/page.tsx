"use client";

import React, { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import TopNav from "@/app/components/ui/TopNav";
import { ArrowLeft, MessageSquare, Loader2, User, Clock } from "lucide-react";
import Link from "next/link";

export default function InquiryThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const docRef = doc(db, "inquiries", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInquiry({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to load inquiry:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInquiry();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021a1d] flex items-center justify-center text-[#C5A059]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-[#021a1d] text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Thread Not Found</h2>
        <Link href="/dashboard?tab=INBOX" className="text-[#C5A059] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021a1d] text-white">
      <TopNav />
      
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 my-10 pb-20">
        {/* Header / Back Button */}
        <div className="mb-8">
          <Link href="/dashboard?tab=INBOX" className="inline-flex items-center text-gray-400 hover:text-white transition gap-2 text-sm font-bold uppercase tracking-wider mb-6">
            <ArrowLeft size={16} /> Back to Inquiry Desk
          </Link>
          
          <div className="flex justify-between items-end">
            <div>
              <span className={`inline-block font-black tracking-wide text-[10px] uppercase px-3 py-1 rounded-full border mb-3 ${
                inquiry.status === "unread" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }`}>
                {inquiry.status || "New"}
              </span>
              <h1 className="text-3xl font-black text-white">{inquiry.subject}</h1>
            </div>
          </div>
        </div>

        {/* Message Ledger */}
        <div className="bg-[#05292e] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Metadata Bar */}
          <div className="bg-black/20 p-6 border-b border-white/5 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <User size={16} className="text-[#C5A059]" />
              <span className="font-bold text-white">{inquiry.buyerName}</span>
              <span className="text-gray-500">({inquiry.buyerEmail})</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 font-mono text-xs ml-auto">
              <Clock size={14} className="text-[#C5A059]" />
              {new Date(inquiry.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Actual Message Body */}
          <div className="p-8 md:p-12">
            <div className="whitespace-pre-wrap text-gray-200 leading-relaxed text-lg font-light">
              {inquiry.message}
            </div>
          </div>
          
        </div>

        {/* Reply Section (Placeholder for now) */}
        <div className="mt-8 bg-[#05292e] border border-white/5 rounded-2xl p-6">
          <h3 className="text-[#C5A059] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageSquare size={14} /> Transmit Reply
          </h3>
          <textarea 
            rows={4}
            className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-white outline-none focus:border-[#C5A059] resize-none mb-4"
            placeholder="Draft your response to the client here..."
          />
          <div className="flex justify-end">
            <button className="bg-[#C5A059] text-black font-black uppercase tracking-wider text-xs px-6 py-3 rounded-lg hover:bg-yellow-500 transition">
              Send Response
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
