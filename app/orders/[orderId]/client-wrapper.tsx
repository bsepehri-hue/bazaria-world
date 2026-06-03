"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { OrderStatus } from "@/lib/orders/types";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Package, Info, Home, ShieldCheck, DollarSign, FileText } from "lucide-react";
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

  // ───────────────────────────────────────────────────────────────────────
  // HYBRID FINANCIAL REGULATORY CORE ENGINE
  // ───────────────────────────────────────────────────────────────────────
  // Derive true item baseline characteristics for multi-channel processing
  const totalPriceUSD = order.totalPriceUSD || 0; 
  const isHighTicket = totalPriceUSD >= 5000;
  
  // High Ticket Configuration Parameters (Defaulting to structured contract guidelines)
  const reservePriceUSD = order.reservePriceUSD || order.totalPriceUSD || 5000;
  const overageDelta = Math.max(0, totalPriceUSD - reservePriceUSD);

  // Execution Fee Computations
  let platformFeeUSD = 0;
  let netEarningsUSD = 0;
  let escrowDepositUSD = 0;
  let finalSettlementDueUSD = 0;

  if (!isHighTicket) {
    // STANDARD RETAIL TRACK (6% Platform Commission Flat Take-rate)
    platformFeeUSD = totalPriceUSD * 0.06;
    netEarningsUSD = totalPriceUSD - platformFeeUSD;
  } else {
    // HIGH-TICKET ESCROW HOLDS (10% Security Deposit and performance incentives)
    escrowDepositUSD = totalPriceUSD * 0.10;
    finalSettlementDueUSD = totalPriceUSD * 0.90;

    const baseDepositFee = reservePriceUSD * 0.10; // Platform captures 10% of the deposit amount up to reserve boundary
    const performanceOverageFee = overageDelta * 0.15; // Platform captures a 15% execution fee above the base tier
    platformFeeUSD = baseDepositFee + performanceOverageFee;
    netEarningsUSD = totalPriceUSD - platformFeeUSD;
  }

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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Section: Items and Shipping Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ordered Items Manifest */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-teal-600" /> Ordered Items Manifest
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item: any, index: number) => (
                <OrderItemRow key={index} item={item} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 mt-4 border-t border-gray-200 gap-2">
              <span className="text-xl font-bold text-gray-900">Total Asset Value:</span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-teal-600">
                  ${totalPriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">USD</span>
                </span>
                {order.totalAmount && (
                  <p className="text-sm font-semibold text-gray-500 mt-1">
                    {formatEther(order.totalAmount)} ETH equiv
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC MERCHANT ACCOUNTING INSIGHTS PANEL */}
          {user?.uid === order.sellerId && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-teal-600" /> Merchant Revenue Breakdown
              </h2>

              {!isHighTicket ? (
                /* Standard Track Calculations Display */
                <div className="space-y-3">
                  <div className="bg-teal-50 border border-teal-100 text-teal-800 text-xs px-3 py-2 rounded-lg font-medium flex items-center mb-2">
                    <ShieldCheck className="w-4 h-4 mr-2 flex-shrink-0" />
                    Standard Retail Order Track Applied (Asset valuation remains under $5,000 threshold).
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Gross Sales Volume</span>
                    <span className="font-semibold text-gray-900">${totalPriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Marketplace Platform Take-Rate (6.0%)</span>
                    <span className="font-semibold">-${platformFeeUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <hr className="my-2 border-dashed" />
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold text-gray-900">Net Distributable Revenue</span>
                    <span className="text-xl font-bold text-emerald-600">${netEarningsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>
              ) : (
                /* High Ticket Track Calculations Display */
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 text-amber-900 text-xs px-3 py-2 rounded-lg font-medium flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" />
                    High-Ticket Escrow Protocol Enabled. Asset value meets or exceeds the $5,000 benchmark.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">On-Chain Escrow Holding (10%)</p>
                      <p className="text-lg font-bold text-blue-600">${escrowDepositUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Off-Platform Balance at Deed Transfer (90%)</p>
                      <p className="text-lg font-bold text-gray-900">${finalSettlementDueUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 pt-2">
                    <div className="flex justify-between">
                      <span>Gross Negotiated Purchase Price</span>
                      <span className="font-semibold text-gray-900">${totalPriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pl-2">
                      <span>↳ Reserve Base Limit Boundary</span>
                      <span>${reservePriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    {overageDelta > 0 && (
                      <div className="flex justify-between text-xs text-purple-600 pl-2">
                        <span>↳ Performance Price Overage Delta</span>
                        <span>+${overageDelta.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-red-600 pt-1">
                      <span>Total Platform Brokerage Commissions</span>
                      <span className="font-semibold">-${platformFeeUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 pl-2 border-l-2 ml-1">
                      <span>(10% of Reserve Deposit + 15% of Overage Premium)</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-800 flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Cancellation Governance Rule:</span> Unilateral breach or arbitrary contract cancellation by the seller triggers an automatic 10% collateral penalty deduction relative to the deposit ledger.
                    </div>
                  </div>

                  <hr className="border-dashed" />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block">Total Net Estimated Valuation</span>
                      <span className="text-xs text-gray-500">(Combined on-chain and off-chain execution)</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">${netEarningsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logistics Handling Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-teal-600" /> Logistics Handling & Fulfilment
            </h2> 

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tracking Reference Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900 mt-0.5 bg-gray-50 px-2 py-1 rounded inline-block border">
                    {order.shippingTrackingNumber || "AWAITING INSERTION"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Logistics Carrier Service</p>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">
                    {order.shippingCarrier || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center">
                  <Home className="w-3.5 h-3.5 mr-1 text-gray-500" /> Destination Delivery Address:
                </h3>
                <AddressBox address={order.shippingAddress} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Section: Actions, Meta, and Execution Timelines */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Dynamic Order Status Updates */}
          <ShippingUpdateForm orderId={order.id} />

          {/* General Metadata */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-teal-600" /> Registry Parameters
            </h3>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Origin Storefront</span>
              <span className="font-semibold text-gray-900">{order.storeName || "Direct Hub"}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Initialization Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* High-Ticket Off-Platform Clearance Blueprint */}
          {isHighTicket && user?.uid === order.sellerId && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3 shadow-sm">
              <h4 className="font-bold text-blue-900 text-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-600" /> High-Ticket Processing Protocol
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Because this asset is categorized under high-valuation mechanics, the baseline 10% escrow deposit is locked on-chain. The remaining 90% balance must be settled during escrow transfer operations (e.g., DMV Title Exchange, Attorney Office Closings, or Direct Bank Wire).
              </p>
              <div className="text-xs font-bold text-blue-900 bg-white/60 rounded px-2.5 py-1.5 border border-blue-100">
                Remaining Settlement Balance: ${finalSettlementDueUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </div>
            </div>
          )}

          {/* Workflow Pipeline Event Stream */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pipeline Processing Stream</h3>

            <div className="relative border-l border-gray-200 pl-4 space-y-6 ml-1">
              {[
                { label: "Order Placed", date: order.createdAt, active: true },
                { label: "Payment Confirmed", date: order.paidAt, active: !!order.paidAt },
                { label: "Logistics Dispatched", date: order.shippedAt, active: !!order.shippedAt },
                { label: "Delivery Arrived", date: order.deliveredAt, active: !!order.deliveredAt },
                { label: "Contract Completed", date: order.completedAt, active: !!order.completedAt },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 bg-white transition-colors ${
                      step.active ? "bg-teal-600 border-teal-600 shadow" : "bg-white border-gray-300"
                    }`}
                  />
                  <p className={`font-semibold text-sm ${step.active ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {step.date
                      ? new Date(step.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Awaiting Action"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Gateway Interface */}
          {user?.uid === order.sellerId && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">State Gateways</h3>
              <p className="text-xs text-gray-500 leading-normal mb-2">
                Update contract lifecycle triggers manually during physical logistics distribution or off-platform verification updates.
              </p>

              <form action={markAsShipped}>
                <input type="hidden" name="orderId" value={order.id} />
                <button className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition shadow-sm hover:shadow text-sm">
                  Mark as Shipped (Dispatch Logistics)
                </button>
              </form>

              <form action={markAsDelivered}>
                <input type="hidden" name="orderId" value={order.id} />
                <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm hover:shadow text-sm">
                  Mark as Delivered (Confirm Carrier Arrival)
                </button>
              </form>

              <form action={markAsCompleted}>
                <input type="hidden" name="orderId" value={order.id} />
                <button className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition shadow-sm hover:shadow text-sm">
                  Mark as Completed (Close Escrow / Release Funds)
                </button>
              </form>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

// State Management Stylings Mapper
function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return { icon: AlertTriangle, text: "Pending Verification", color: "border-yellow-400 text-yellow-700 bg-yellow-50/50" };
    case "shipped":
      return { icon: Package, text: "Logistics Dispatched", color: "border-blue-400 text-blue-700 bg-blue-50/50" };
    case "delivered":
      return { icon: Package, text: "Delivery Arrived", color: "border-emerald-400 text-emerald-700 bg-emerald-50/50" };
    case "cancelled":
      return { icon: AlertTriangle, text: "Voided / Cancelled", color: "border-red-400 text-red-700 bg-red-50/50" };
    case "awaiting-payment":
      return { icon: AlertTriangle, text: "Awaiting Payment rails", color: "border-orange-400 text-orange-700 bg-orange-50/50" };
    default:
      return { icon: AlertTriangle, text: "Unknown Core State", color: "border-gray-400 text-gray-700 bg-gray-50/50" };
  }
}
