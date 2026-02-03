import React from 'react';
import Link from 'next/link';import { TimelineEvent } from "@/app/types/timeline";
import { getActivityIcon } from "@/app/components/timeline/getActivityIcon";
import { Clock } from 'lucide-react';

interface ActivityListItemProps {
  event: TimelineEvent;
}

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
};

export const ActivityListItem: React.FC<ActivityListItemProps> = ({ event }) => {
  const { icon: Icon, color, bgColor } = getTimelineIcon(event.type);
  const timeAgo = formatTimeAgo(event.timestamp);

  return (
    <Link
      href={event.link || '#'}
      className={`block rounded-xl p-4 border transition 
        ${event.isHighPriority 
          ? 'border-teal-300 shadow-lg hover:shadow-xl' 
          : 'border-gray-200 shadow-sm hover:shadow-md'
        } bg-white`}
    >
      <div className="flex items-start space-x-4">

        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className={`font-semibold ${event.isHighPriority ? 'text-teal-700' : 'text-gray-900'}`}>
            {event.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
        </div>

        {/* Timestamp */}
        <div className="flex items-center text-xs text-gray-500 whitespace-nowrap ml-2 pt-1">
          <Clock className="w-3 h-3 mr-1" />
          {timeAgo}
        </div>
      </div>
    </Link>
  );
};
