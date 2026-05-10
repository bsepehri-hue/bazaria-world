import {
  DollarSign,
  UserPlus,
  Wallet,
  Bell,
  Package,
  MessageSquare,
  Star,
} from "lucide-react";

export const TIMELINE_META: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  sale: {
    icon: DollarSign,
    color: "text-teal-600",
    label: "Sale",
  },
  referral: {
    icon: UserPlus,
    color: "text-amber-600",
    label: "Referral",
  },
  payout: {
    icon: Wallet,
    color: "text-emerald-600",
    label: "Payout",
  },
  message: {
    icon: MessageSquare,
    color: "text-blue-600",
    label: "Message",
  },
  order: {
    icon: Package,
    color: "text-purple-600",
    label: "Order",
  },
  system: {
    icon: Bell,
    color: "text-gray-500",
    label: "System",
  },
  achievement: {
    icon: Star,
    color: "text-yellow-500",
    label: "Achievement",
  },
};