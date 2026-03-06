import {
  faCreditCard,
  faMoneyBillTransfer,
  faClockRotateLeft
} from "@fortawesome/free-solid-svg-icons";

export const payableMenu = [
  { label: "Payable", icon: faCreditCard, href: "/payable" },
  { label: "Transfers", icon: faMoneyBillTransfer, href: "/payable/transfers" },
  { label: "History", icon: faClockRotateLeft, href: "/payable/history" }
];
