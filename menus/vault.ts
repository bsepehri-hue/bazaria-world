import {
  faVault,
  faChartLine,
  faKey,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";

export const vaultMenu = [
  { label: "Overview", icon: faVault, href: "/vault" },
  { label: "Metrics", icon: faChartLine, href: "/vault/metrics" },
  { label: "Reveal", icon: faKey, href: "/vault/reveal" },
  { label: "Admin", icon: faUserShield, href: "/vault/admin" }
];
