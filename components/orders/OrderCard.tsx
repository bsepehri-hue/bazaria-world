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
  buyer: string;
  seller: string;
  amount: number;
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
  const orderDate = order.orderDate.toLocaleDateString();

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="group block bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition duration-300 hover:shadow-xl hover:border-teal-500"
    >
      <div className="flex justify-between items-start mb-4 border-b pb-3">
        {/* Order ID and Date */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Placed on: {orderDate}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
          <Icon className="w-3 h-3 mr-1" />
          {statusText}
        </div>
      </div>

      <div className="space-y-3">
        {/* Buyer Info */}
        <p className="text-sm text-gray-700 flex justify-between">
          <span className="font-medium">Buyer:</span>
          <span className="font-mono text-teal-600">{shortenAddress(order.buyerAddress)}</span>
        </p>

        {/* Item Summary */}
        <p className="text-sm text-gray-700 flex justify-between">
          <span className="font-medium">Items:</span>
          <span>{order.items.length} listing{order.items.length !== 1 ? 's' : ''}</span>
        </p>

        {/* Total Amount */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-xl font-extrabold text-teal-600">
            {totalAmount} <span className="text-sm font-semibold">ETH</span>
          </span>
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-4 text-right">
        <span className="inline-flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-800 transition">
          View Details <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};
