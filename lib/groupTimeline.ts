import type { TimelineEvent } from "@/types/timeline";

export function groupTimelineByDay(events: TimelineEvent[]) {
  const groups: Record<string, TimelineEvent[]> = {};

  for (const event of events) {
    const day = new Date(event.timestamp).toISOString().split("T")[0];
    if (!groups[day]) groups[day] = [];
    groups[day].push(event);
  }

  return groups;
}
