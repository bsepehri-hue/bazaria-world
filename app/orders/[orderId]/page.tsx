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
  const order = await getOrderById(params.orderId);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <ClientOrderView order={order} orderId={params.orderId} />
    </div>
  );
}


