import {
  FaStore,
  FaGift,
  FaWallet,
  FaGavel,
  FaUserShield,
  FaCog,
  FaEnvelope,
  FaBell,
  FaLifeRing,
} from "react-icons/fa";

export const getSidebarItems = (userUid: string | null) => [
  { name: "Marketplace", href: "/market", icon: FaStore },
  { name: "Rewards", href: "/rewards", icon: FaGift },
  { name: "Vault", href: "/account/vault", icon: FaWallet },
  { 
    name: "Storefront", 
    href: userUid ? `/storefront/${userUid}` : "/market", 
    icon: FaStore 
  },
  { name: "Auctions", href: "/auctions", icon: FaGavel },
  { name: "Admin", href: "/admin", icon: FaUserShield },
  { name: "Settings", href: "/settings", icon: FaCog },
  { name: "Messages", href: "/market/inbox", icon: FaEnvelope },
  { name: "Notifications", href: "/notifications", icon: FaBell },
  { name: "Support", href: "/support", icon: FaLifeRing },
];
