'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Users, Loader2 } from "lucide-react";
import { ConversationList } from '@/components/chat/ConversationList';
import { ConversationView } from '@/components/chat/ConversationView';
import { getConversations } from '@/actions/chat';
import { Conversation } from '@/lib/mockData/chat';
import useSWR from 'swr';
import { useAuth } from "@/app/providers/AuthProvider"; // Use your established hook

const conversationFetcher = async () => {
  const data = await getConversations();
  return data;
};

export default function MessagesDashboardPage() {
  const { user } = useAuth();
  const userId = user?.uid;

  const { data: conversations, error, isLoading } = useSWR<Conversation[]>(
    userId ? '/api/conversations' : null, // Only fetch if user exists
    conversationFetcher,
    { refreshInterval: 15000 }
  );

  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);

  const selectedConversation = useMemo(() => {
    if (!selectedConvoId || !conversations) return null;
    return conversations.find(c => c.id === selectedConvoId) || null;
  }, [selectedConvoId, conversations]);

  useEffect(() => {
    if (!selectedConvoId && conversations && conversations.length > 0) {
      setSelectedConvoId(conversations[0].id);
    }
  }, [conversations, selectedConvoId]);

  if (!userId || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#004d40] mb-4" />
        <p>Loading your Inquiry Portal...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden m-4">
      {/* Title Bar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h1 className="text-xl font-bold text-[#004d40] flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Inquiry Portal
        </h1>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar: Threads */}
        <div className="w-80 border-right border-gray-100 overflow-y-auto bg-white">
          <ConversationList
            conversations={conversations || []}
            selectedId={selectedConvoId}
            onSelect={setSelectedConvoId}
            userId={userId}
          />
        </div>

        {/* Main: Chat View */}
        <div className="flex-1 bg-white min-w-0">
          {selectedConversation ? (
            <ConversationView conversation={selectedConversation} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Select a trade conversation to begin.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
