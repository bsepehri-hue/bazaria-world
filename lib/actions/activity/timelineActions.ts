"use server";

import { TimelineEvent, mockTimelineFeed } from '@/lib/mockData/timeline';

/**
 * Server Action to fetch the unified, chronological activity feed for the dashboard.
 */
export async function getUnifiedTimeline(): Promise<TimelineEvent[]> {
  // Simulate network delay and processing time
  await new Promise(resolve => setTimeout(resolve, 200)); 
  
  // In a real app: Combine and sort events from all backend services (Auctions, Orders, Referrals, etc.)
  
  return mockTimelineFeed;
}
