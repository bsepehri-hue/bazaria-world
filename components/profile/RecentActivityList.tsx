import React from 'react';
import Link from 'next/link';
import { Zap, Clock } from 'lucide-react';
import { mockRecentActivity, getActivityIcon } from '@/lib/mockData/profile';


interface ActivityListProps {
  activities: any[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-red-500" />
        Recent Activity
      </h3>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 italic">No recent activity to display.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {activities.slice(0, 5).map((activity) => {
            const Icon: React.ComponentType<{ className?: string }> =
            getActivityIcon(activity.type);
            const timeAgo = Math.floor((Date.now() - activity.timestamp.getTime()) / (1000 * 60 * 60)); // Hours ago

            return (
              <Link
                key={activity.id}
                href={activity.link || '#'}
                className="flex items-start py-3 transition duration-150 hover:bg-gray-50 rounded-md -mx-2 px-2"
              >
                {/* Icon */}
                <div className="flex-shrink-0 p-2 rounded-full bg-teal-50 text-teal-600">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Description */}
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-800">{activity.description}</p>
                </div>
                
                {/* Timestamp */}
                <div className="text-right flex-shrink-0 text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo < 24 ? `${timeAgo}h ago` : activity.timestamp.toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      )}
      
      <div className="pt-2 text-center border-t border-gray-100">
          <button className="text-sm font-medium text-teal-600 hover:text-teal-800 transition">
              View All Activity &rarr;
          </button>
      </div>
    </div>
  );
};
