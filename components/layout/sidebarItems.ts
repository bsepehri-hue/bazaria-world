import {
  FaStore,
  FaGift,
  FaWallet,
  FaGavel,
  FaUserShield,
  FaCog,
  FaEnvelope,
  FaBell,
  FaHeadset, // Support icon
} from "react-icons/fa6";

export const sidebarItems = [
  { name: "Marketplace", href: "/market", icon: FaStore },
  { name: "Rewards", href: "/rewards", icon: FaGift },
  { name: "Vault", href: "/vault", icon: FaWallet },
  { name: "Storefronts", href: "/storefronts", icon: FaStore }, // FIXED
  { name: "Auctions", href: "/auctions", icon: FaGavel },
  { name: "Admin", href: "/admin", icon: FaUserShield },
  { name: "Settings", href: "/settings", icon: FaCog },
  { name: "Messages", href: "/messages", icon: FaEnvelope },
  { name: "Notifications", href: "/notifications", icon: FaBell },
  { name: "Support", href: "/support", icon: FaHeadset }, // FIXED
];
