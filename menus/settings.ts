import {
  faUser,
  faLock,
  faSliders
} from "@fortawesome/free-solid-svg-icons";

export const settingsMenu = [
  { label: "Profile", icon: faUser, href: "/settings/profile" },
  { label: "Security", icon: faLock, href: "/settings/security" },
  { label: "Preferences", icon: faSliders, href: "/settings/preferences" }
];
