'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Truck, Clock } from 'lucide-react';
import { shortenAddress, formatEther } from '@/lib/utils';

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type Order = {
  id: string;
  buyer: string;        // wallet address
  seller: string;       // wallet address
  amount: number;       // stored in wei (number)
  status: OrderStatus;
  createdAt: number | Date;
};

interface OrderCardProps {
  order: Order;
}

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "processing":
      return { icon: Clock, text: "Processing", color: "text-yellow-700 bg-yellow-100" };
    case "shipped":
      return { icon: Truck, text: "Shipped", color: "text-blue-700 bg-blue-100" };
    case "delivered":
      return { icon: Package, text: "Delivered", color: "text-green-700 bg-green-100" };
    case "cancelled":
      return { icon: Clock, text: "Cancelled", color: "text-red-700 bg-red-100" };
    case "pending":
    default:
      return { icon: Clock, text: "Pending", color: "text-gray-700 bg-gray-100" };
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { icon: Icon, text: statusText, color: statusColor } = getStatusClasses(order.status);

  const totalAmount = formatEther(BigInt(order.amount));
  const orderDate = new Date(order.createdAt);

  return (
  <Link
    href={`/orders/${order.id}`}
    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${statusColor.split(' ')[0]}`} />
        <span className={`text-sm font-medium ${statusColor}`}>{statusText}</span>
      </div>

      <ArrowRight className="w-4 h-4 text-gray-400" />
    </div>

    <div className="space-y-2 text-sm">
      <p className="flex justify-between">
        <span className="font-medium">Amount:</span>
        <span className="font-mono text-teal-600">{totalAmount} ETH</span>
      </p>

      <p className="flex justify-between">
        <span className="font-medium">Buyer:</span>
        <span className="font-mono text-teal-600">{shortenAddress(order.buyer)}</span>
      </p>

      <p className="flex justify-between">
        <span className="font-medium">Seller:</span>
        <span className="font-mono text-teal-600">{shortenAddress(order.seller)}</span>
      </p>

      <p className="flex justify-between">
        <span className="font-medium">Date:</span>
        <span className="text-gray-600">
          {orderDate.toLocaleDateString()}{" "}
          {orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </p>
    </div>
  </Link>
);
