// SERVER COMPONENT — PAGE WRAPPER
import { getOrderById } from "@/lib/orders/data";
import { OrderStatus } from "@/lib/orders/types";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Package, Info, Home } from "lucide-react";
import { formatEther } from "@/lib/utils";
import OrderItemRow from "@/components/orders/OrderItemRow";
import AddressBox from "@/components/orders/AddressBox";
import { ShippingUpdateForm } from "@/components/orders/ShippingUpdateForm";
import { markAsShipped, markAsDelivered, markAsCompleted } from "./actions";


// ─────────────────────────────────────────────
// Server Actions (safe stubs — fill in later)
// ─────────────────────────────────────────────





// ─────────────────────────────────────────────
// Helper: Status → icon/text/color
// ─────────────────────────────────────────────

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return { icon: AlertTriangle, text: "Pending", color: "border-yellow-500 text-yellow-700" };

    case "shipped":
      return { icon: Package, text: "Shipped", color: "border-blue-500 text-blue-700" };

    case "delivered":
      return { icon: Package, text: "Delivered", color: "border-green-500 text-green-700" };

    case "cancelled":
      return { icon: AlertTriangle, text: "Cancelled", color: "border-red-500 text-red-700" };

    case "awaiting-payment":
      return { icon: AlertTriangle, text: "Payment Pending", color: "border-orange-500 text-orange-700" };

    default:
      return { icon: AlertTriangle, text: "Unknown", color: "border-gray-500 text-gray-700" };
  }
}

// ─────────────────────────────────────────────
// CLIENT WRAPPER — handles Firebase user
// ─────────────────────────────────────────────

import ClientOrderView from "./client-wrapper";

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  // 1. TEMPORARY TEST OBJECT: Change totalPriceUSD to flip the tracks!
  // Set to 1200 for Standard Track | Set to 15000 for High-Ticket Track
  const mockOrder = {
    id: params.orderId,
    sellerId: "CURRENT_USER_ID_OR_STUB", // Change this or match your test login ID to see Seller Actions
    storeName: "Bazaria Luxury Hub",
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
    shippedAt: null,
    deliveredAt: null,
    completedAt: null,
    status: "pending",
    shippingTrackingNumber: "",
    shippingCarrier: "",
    shippingAddress: {
      name: "John Doe",
      line1: "123 Ocean Drive",
      city: "Miami",
      state: "FL",
      postalCode: "33139",
      country: "US"
    },
    items: [
      {
        title: "Premium Marketplace Asset Listing",
        quantity: 1,
        priceUSD: 15000 // Test pricing match
      }
    ],
    // Core Engine Rule Variables
    totalPriceUSD: 15000,       // <-- Try 1200 to see Standard Retail layout!
    reservePriceUSD: 12000,     // <-- Baseline Reserve boundary configuration
    totalAmount: "5000000000000000000" // Optional: 5 ETH in Wei equivalent
  };

  // 2. Bypass database call temporarily for layout inspection
  const order = mockOrder; 

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <ClientOrderView order={order} orderId={params.orderId} />
    </div>
  );
}

