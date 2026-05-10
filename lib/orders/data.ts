// src/lib/orders/data.ts

import { shortenAddress } from "@/lib/utils";

// --- Type Definitions ---

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  auctionId: string;
  listingName: string;
  finalPrice: bigint; // Price in Wei
  itemUri: string; // Image/metadata link
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  buyerAddress: string;
  sellerAddress: string;
  storefrontId: string;
  storeName?: string;
  status: OrderStatus;
  createdAt: Date;          // renamed from orderDate
  totalAmount: bigint;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingTrackingNumber: string | null;
  shippingCarrier: string | null;
}

// --- Mock Data ---

const oneEth = BigInt("1000000000000000000");
const pointTwoEth = BigInt("200000000000000000");

const mockShippingAddress: ShippingAddress = {
  name: "Jane Doe",
  street: "123 Auction Lane",
  city: "Amoy City",
  state: "PO",
  zip: "12345",
  country: "Polygon",
};

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    buyerAddress: shortenAddress("0xBuyerAddr0123456789"),
    sellerAddress: shortenAddress("0xSellerAddrAABBCCDD"),
    storefrontId: "1",
    storeName: "Emerald Treasures",
    status: "PROCESSING",
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    totalAmount: oneEth * BigInt(5),
    items: [
      {
        auctionId: "101",
        listingName: "Rare Emerald Necklace",
        finalPrice: oneEth * BigInt(5),
        itemUri: "https://placehold.co/100x100/00d164/white?text=A101",
      },
    ],
    shippingAddress: mockShippingAddress,
    shippingTrackingNumber: null,
    shippingCarrier: null,
  },
  {
    id: "ORD-2024-002",
    buyerAddress: shortenAddress("0xBuyerAddr9876543210"),
    sellerAddress: shortenAddress("0xSellerAddrAABBCCDD"),
    storefrontId: "2",
    storeName: "Fashion Hub",
    status: "SHIPPED",
    createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    totalAmount: pointTwoEth * BigInt(10),
    items: [
      {
        auctionId: "105",
        listingName: "Limited Edition Jumper",
        finalPrice: pointTwoEth * BigInt(10),
        itemUri: "https://placehold.co/100x100/3498db/white?text=A105",
      },
    ],
    shippingAddress: { ...mockShippingAddress, name: "John Smith" },
    shippingTrackingNumber: "LTB987654321",
    shippingCarrier: "FedEx",
  },
  {
    id: "ORD-2024-003",
    buyerAddress: shortenAddress("0xBuyerAddrEEEEFFFF"),
    sellerAddress: shortenAddress("0xSellerAddrAABBCCDD"),
    storefrontId: "1",
    storeName: "Leather Works",
    status: "PENDING_PAYMENT",
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    totalAmount: oneEth * BigInt(1),
    items: [
      {
        auctionId: "110",
        listingName: "Custom Leather Bag",
        finalPrice: oneEth * BigInt(1),
        itemUri: "https://placehold.co/100x100/e67e22/white?text=A110",
      },
    ],
    shippingAddress: mockShippingAddress,
    shippingTrackingNumber: null,
    shippingCarrier: null,
  },
];

// --- Helpers ---

export async function getOrderById(id: string): Promise<Order | undefined> {
  return mockOrders.find((o) => o.id === id);
}