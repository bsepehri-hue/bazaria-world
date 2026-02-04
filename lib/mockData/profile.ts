import { Zap, Clock, User, Star } from "lucide-react";

export const mockRecentActivity = [
  { id: 1, action: "Stub activity" }
];

export function getActivityIcon(type: string) {
  switch (type) {
    case "order":
      return Zap;
    case "login":
      return Clock;
    case "profile":
      return User;
    case "review":
      return Star;
    default:
      return Clock; // fallback icon
  }
}
