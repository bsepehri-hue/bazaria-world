import React from "react";

export default function OrderItemRow({ item }: { item: any }) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-gray-800">{item.name}</span>
      <span className="text-gray-600">
        {item.quantity} × {item.price}
      </span>
    </div>
  );
}
