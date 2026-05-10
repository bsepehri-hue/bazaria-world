import { TimelineEvent } from "@/app/types/timeline";
import ActivityTimeline from "./ActivityTimeline";

interface ActivityTimelineClientProps {
  timeline: TimelineEvent[];
}

export default function ActivityTimelineClient({ timeline }: ActivityTimelineClientProps) {
  return <ActivityTimeline timeline={timeline} />;
}
