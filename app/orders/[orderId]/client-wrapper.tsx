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
                      <span className="text-
