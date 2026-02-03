'use client';

import React, { useRef, useEffect, useState, useTransition } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { getMessages, sendMessage } from '@/actions/chat';
import { Conversation, Message, CURRENT_USER_ID, CURRENT_USER_NAME } from '@/lib/mockData/chat';


interface ConversationViewProps {
  conversation: Conversation;
}

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isSelf = message.senderId === CURRENT_USER_ID;
  
  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
        isSelf ? 'bg-teal-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
      }`}>
        <p className="text-xs font-semibold mb-1 opacity-80">{isSelf ? 'You' : message.senderName}</p>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isSelf ? 'text-teal-200' : 'text-gray-400'} text-right`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};


// Composer Form Component
const Composer: React.FC<{ conversationId: string, onMessageSent: (message: Message) => void }> = ({ conversationId, onMessageSent }) => {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleAction = async (formData: FormData) => {
  startTransition(async () => {
    const content = formData.get("content") as string;
    const conversationId = formData.get("conversationId") as string;

    const result = await sendMessage(conversationId, content);

    if (result) {
      onMessageSent(result);
      formRef.current?.reset();
    } else {
      alert('Failed to send message. Please try again.');
    }
  });
};

  return (
    <form ref={formRef} action={handleAction} className="p-4 border-t border-gray-200 bg-white flex space-x-3 sticky bottom-0">
      <input type="hidden" name="conversationId" value={conversationId} />
      
      <input
        type="text"
        name="content"
        required
        placeholder="Type your message..."
        disabled={isPending}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition disabled:bg-gray-100"
      />
      
      <button
        type="submit"
        disabled={isPending}
        className={`p-3 rounded-lg text-white font-semibold transition duration-150 flex items-center justify-center
          ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}
        `}
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      </button>
    </form>
  );
};

export const ConversationView: React.FC<ConversationViewProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 Compute the other party based on participants
  const otherPartyId = conversation.participants.find(p => p !== CURRENT_USER_ID) || "unknown_user";
  const otherPartyName = otherPartyId === CURRENT_USER_ID ? "You" : otherPartyId;



  // Function to load message history
  const loadMessages = async (id: string) => {
    setIsLoading(true);
    try {
      const history = await getMessages(id);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load messages whenever the selected conversation changes
  useEffect(() => {
    loadMessages(conversation.id);
  }, [conversation.id]);

  // Effect to scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handler for optimistic update after sending a message
  const handleMessageSent = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Conversation Header */}
     <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
  <h3 className="text-xl font-bold text-gray-900">
    Chat with: <span className="text-teal-600">{otherPartyName}</span>
  </h3>
  <p className="text-sm text-gray-500">Wallet ID: {otherPartyId}</p>
</div>



      {/* Message History Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="text-center text-gray-500 pt-10">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-500" /> Loading messages...
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <Composer conversationId={conversation.id} onMessageSent={handleMessageSent} />
    </div>
  );
};
