import React from 'react';
import { TimelineEvent } from '@/app/types/timeline';
import { ActivityListItem } from './ActivityListItem';

interface ActivityListProps {
  events: TimelineEvent[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500 text-lg">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <ActivityListItem key={event.id} event={event} />
      ))}
    </div>
  );
};
