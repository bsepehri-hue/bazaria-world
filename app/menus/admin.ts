import {
  faGaugeHigh,
  faUsers,
  faFileLines,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

export const adminMenu = [
  { label: "Dashboard", icon: faGaugeHigh, href: "/admin" },
  { label: "Users", icon: faUsers, href: "/admin/users" },
  { label: "Logs", icon: faFileLines, href: "/admin/logs" },
  { label: "Permissions", icon: faShieldHalved, href: "/admin/permissions" }
];
