"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { OrderStatus } from "@/lib/orders/types";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Package, Info, Home } from "lucide-react";
import { formatEther } from "@/lib/utils";
import OrderItemRow from "@/components/orders/OrderItemRow";
import AddressBox from "@/components/orders/AddressBox";
import { ShippingUpdateForm } from "@/components/orders/ShippingUpdateForm";
import { markAsShipped, markAsDelivered, markAsCompleted } from "./actions";

export default function ClientOrderView({ order, orderId }: any) {
  const user = useAuthUser();

  if (!order) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl shadow-lg mt-8">
        <AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-800">Order Not Found</h1>
        <p className="text-gray-600 mt-2">Could not load order ID: {orderId}.</p>
        <Link
          href="/dashboard/orders"
          className="mt-4 inline-flex items-center text-teal-600 hover:text-teal-800 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const { icon: StatusIcon, text: statusText, color: statusColor } =
    getStatusClasses(order.status as OrderStatus);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders List
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order Details: <span className="text-teal-600">#{order.id}</span>
          </h1>
        </div>
        <div
          className={`flex items-center text-sm font-bold px-4 py-2 rounded-full border ${statusColor}`}
        >
          <StatusIcon className="w-4 h-4 mr-2" />
          {statusText}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-teal-600" /> Ordered Items
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, index: number) => (
                <OrderItemRow key={index} item={item} />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-900">Order Total:</span>
              <span className="text-2xl font-extrabold text-red-600">
                {formatEther(order.totalAmount)} <span className="text-lg">ETH</span>
              </span>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-teal-600" /> Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Tracking Number:</p>
                <p className="text-lg font-mono text-gray-900">
                  {order.shippingTrackingNumber || "N/A"}
                </p>

                <p className="text-sm font-semibold text-gray-600">Carrier:</p>
                <p className="text-lg font-medium text-gray-900">
                  {order.shippingCarrier || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                  <Home className="w-4 h-4 mr-1" /> Ship To:
                </h3>
                <AddressBox address={order.shippingAddress} />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-1 space-y-6">
          <ShippingUpdateForm orderId={order.id} />


          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Order Metadata</h3>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Store</span>
              <span>{order.storeName}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Placed</span>
              <span>{new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}</span>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Timeline</h3>

            <div className="relative border-l border-gray-300 pl-4 space-y-6">

              {[
                { label: "Order Placed", date: order.createdAt, active: true },
                { label: "Payment Confirmed", date: order.paidAt, active: !!order.paidAt },
                { label: "Shipped", date: order.shippedAt, active: !!order.shippedAt },
                { label: "Delivered", date: order.deliveredAt, active: !!order.deliveredAt },
                { label: "Completed", date: order.completedAt, active: !!order.completedAt },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${
                      step.active ? "bg-teal-600" : "bg-gray-300"
                    }`}
                  />
                  <p className="font-semibold text-gray-900">{step.label}</p>
                  <p className="text-sm text-gray-600">
                    {step.date
                      ? new Date(step.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Pending"}
                  </p>
                </div>
              ))}

            </div>
          </div>

          {/* Seller Actions */}
          {user?.uid === order.sellerId && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seller Actions</h3>

              <form action={markAsShipped}>
                <input type="hidden" name="orderId" value={order.id} />
                <button className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600">
                  Mark as Shipped
                </button>
              </form>

              <form action={markAsDelivered}>
                <input type="hidden" name="orderId" value={order.id} />
                <button className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600">
                  Mark as Delivered
                </button>
              </form>

              <form action={markAsCompleted}>
                <input type="hidden" name="orderId" value={order.id} />
                <button className="w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600">
                  Mark as Completed
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper duplicated here because this is a client file
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
