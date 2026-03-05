import {
  faGavel,
  faClock,
  faTrophy
} from "@fortawesome/free-solid-svg-icons";

export const auctionsMenu = [
  { label: "Auctions", icon: faGavel, href: "/auctions" },
  { label: "Live", icon: faClock, href: "/auctions/live" },
  { label: "Won", icon: faTrophy, href: "/auctions/won" }
];
