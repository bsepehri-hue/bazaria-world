
"use client";

import React from "react";
import { Bell, ShieldCheck, Tag, Info, Calendar } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

// Mock data structure - later you can link this to a "notifications" collection in Firestore
const mockNotifications = [
  {
    id: "1",
    title: "KYC Verified",
    message: "Your identity verification is complete. you can now list heavy assets.",
    type: "success",
    time: "2 hours ago",
    icon: <ShieldCheck className="text-green-600" />,
  },
  {
    id: "2",
    title: "New Bid Received",
    message: "A new inquiry has been placed on your 2024 CAT Excavator.",
    type: "info",
    time: "5 hours ago",
    icon: <Tag className="text-teal-600" />,
  },
  {
    id: "3",
    title: "System Update",
    message: "The Bazaria Registry will undergo scheduled maintenance tonight at 02:00 UTC.",
    type: "warning",
    time: "1 day ago",
    icon: <Info className="text-amber-600" />,
  },
];

export default function NotificationsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#004d40] flex items-center gap-3">
          <Bell className="w-6 h-6" />
          System Notifications
        </h1>
        <button className="text-sm text-teal-700 hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notif) => (
            <div 
              key={notif.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50 p-3 rounded-full h-fit">
                {notif.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {notif.time}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No new notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
