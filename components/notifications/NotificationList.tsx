'use client';

import React from 'react';
import Link from 'next/link';
import { markNotificationsAsRead } from '@/actions/notifications';
import { Bell, MessageSquare, CheckCircle } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number | Date;
  type?: string;
  link?: string;
};

function getNotificationIcon(type?: string) {
  switch (type) {
    case 'message':
      return <MessageSquare className="w-4 h-4 text-teal-600" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
}

interface NotificationListProps {
  notifications: Notification[];
  isDropdown?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, isDropdown = false }) => {

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationsAsRead([notification.id]);
    }

    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 italic">
        You are all caught up!
      </div>
    );
  }

  return (
    <div className={`divide-y divide-gray-100 ${isDropdown ? 'max-h-80 overflow-y-auto' : ''}`}>
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        const date = new Date(notification.createdAt);

        const baseClasses = 'flex p-3 transition duration-150 cursor-pointer';
        const unreadClasses = 'bg-teal-50 hover:bg-teal-100';
        const readClasses = 'bg-white hover:bg-gray-50';

        return (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`${baseClasses} ${notification.read ? readClasses : unreadClasses}`}
          >
            <div className={`flex-shrink-0 p-2 rounded-full ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-teal-600 text-white'}`}>
             {Icon}
            </div>

            <div className="ml-3 flex-1 overflow-hidden">
              <p className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                {notification.title}
              </p>
              <p className={`text-xs mt-0.5 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {!notification.read && (
              <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0 mt-1" title="Unread"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
