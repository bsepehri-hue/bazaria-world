import React from 'react';
import { MessageSquare, Circle } from 'lucide-react';
import { Conversation } from '@/lib/mockData/chat';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userId: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedId, onSelect, userId }) => {

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-teal-600" />
          Conversations ({conversations.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {conversations.map((convo) => {
  const isSelected = convo.id === selectedId;
  const isUnread = convo.unreadCount > 0;

  // ✅ Compute before JSX
  const otherPartyId = convo.participants.find((p) => p !== userId);
  const otherPartyName = otherPartyId || "Unknown User";

  return (
    <div
      key={convo.id}
      onClick={() => onSelect(convo.id)}
      className={`
        p-4 cursor-pointer transition duration-150 relative
        ${isSelected ? 'bg-teal-50 border-l-4 border-teal-600' : 'hover:bg-gray-50'}
      `}
    >
      <div className="flex justify-between items-start">
        <p className={`font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
          {otherPartyName}
        </p>

        {isUnread && (
          <span className="flex items-center text-xs font-bold text-white bg-red-500 rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
            {convo.unreadCount}
          </span>
        )}
      </div>

      <p className={`text-sm mt-1 truncate ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
        {convo.lastMessage}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {convo.lastMessageTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
     </p>
        </div>
      );
    })}
      </div>
    </div>
  );
};

