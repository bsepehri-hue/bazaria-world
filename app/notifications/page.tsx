'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, Users, Loader2 } from "lucide-react";
import { ConversationList } from '@/components/chat/ConversationList';
import { ConversationView } from '@/components/chat/ConversationView';
import { getConversations } from '@/actions/chat';
import { Conversation } from '@/lib/mockData/chat';
import useSWR from 'swr';
import { auth } from "@/lib/firebase"; // if not already imported



const conversationFetcher = async () => {
  const data = await getConversations();
  return data;
};

export default function MessagesDashboardPage() {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading user…
      </div>
    );
  }

  const { data: conversations, error, isLoading } = useSWR<Conversation[]>(
    '/api/conversations',
    conversationFetcher,
    { refreshInterval: 15000 }
  );




  

  
  // Client state for the currently selected conversation ID
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);

  // Determine the conversation object based on the selected ID
  const selectedConversation = useMemo(() => {
    if (!selectedConvoId || !conversations) return null;
    return conversations.find(c => c.id === selectedConvoId) || null;
  }, [selectedConvoId, conversations]);

  // Automatically select the first conversation on initial load
  React.useEffect(() => {
    if (!selectedConvoId && conversations && conversations.length > 0) {
      setSelectedConvoId(conversations[0].id);
    }
  }, [conversations, selectedConvoId]);


  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-600" />
        Loading conversations...
      </div>
    );
  }

  if (error || !conversations) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
        <p>Error loading conversations. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50 rounded-xl overflow-hidden">
      
      {/* Title */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-teal-600" />
            Direct Messaging
        </h1>
      </div>

      <div className="flex flex-1 min-h-0">
        
        {/* Left Pane: Conversation List (Visible on all screen sizes) */}
        <div className="w-full sm:w-80 flex-shrink-0">
       
          <ConversationList
  conversations={conversations}
  selectedId={selectedConvoId}
  onSelect={setSelectedConvoId}
  userId={userId}
/>

        </div>

        {/* Right Pane: Conversation View */}
        <div className="flex-1 bg-white border-l border-gray-200 min-w-0">
          {selectedConversation ? (
            <ConversationView conversation={selectedConversation} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">Select a conversation to begin chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
