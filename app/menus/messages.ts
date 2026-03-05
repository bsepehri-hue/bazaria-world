import {
  faEnvelope,
  faPaperPlane,
  faBoxArchive
} from "@fortawesome/free-solid-svg-icons";

export const messagesMenu = [
  { label: "Inbox", icon: faEnvelope, href: "/messages" },
  { label: "Sent", icon: faPaperPlane, href: "/messages/sent" },
  { label: "Archive", icon: faBoxArchive, href: "/messages/archive" }
];
