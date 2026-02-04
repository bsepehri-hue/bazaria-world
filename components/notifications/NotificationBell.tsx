'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckSquare } from 'lucide-react';
import { getNotifications, markNotificationsAsRead } from '@/actions/notifications';
import { NotificationList } from './NotificationList';
import Link from 'next/link';
import { useAuthUser } from '@/hooks/useAuthUser';

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number | Date;
};

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bellRef = useRef<HTMLDivElement>(null);
  

  const unreadCount = notifications.filter(n => !n.read).length;

  // --- Data Fetching ---
const user = useAuthUser();


const fetchNotifications = async () => {
  if (!user?.uid) return;

  setIsLoading(true);
  try {
    const data = await getNotifications(user.uid);
    setNotifications(data);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchNotifications();
    // Set interval to refresh notifications every minute (typical for a live app)
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval);
  }, []);

  // --- Mark All Read Handler ---
  const handleMarkAllRead = async () => {
  const ids = notifications.map(n => n.id); // collect all IDs
  await markNotificationsAsRead(ids);       // ✅ pass them in
  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
};

  // --- Outside Click Handler for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bellRef]);

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-150"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 origin-top-right animate-in fade-in-0 zoom-in-95">
          
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <h4 className="text-lg font-bold text-gray-900">Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead} 
                className="flex items-center text-xs font-medium text-teal-600 hover:text-teal-800"
                disabled={isLoading}
              >
                <CheckSquare className="w-3 h-3 mr-1" /> Mark All Read
              </button>
            )}
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <NotificationList notifications={notifications.slice(0, 5)} isDropdown={true} />
          )}

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 text-center">
            <Link href="/dashboard/messages" onClick={() => setIsOpen(false)} className="text-sm font-medium text-teal-600 hover:text-teal-800">
              View All Notifications &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
