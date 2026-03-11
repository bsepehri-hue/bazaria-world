import {
  FaStore,
  FaGift,
  FaWallet,
  FaGavel,
  FaUserShield,
  FaCog,
  FaEnvelope,
  FaBell,
  FaLifeRing, // Support icon (FA5)
} from "react-icons/fa";

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
