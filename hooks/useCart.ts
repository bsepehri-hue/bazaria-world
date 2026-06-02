"use client";

import { useContext } from "react";
// 🎯 Import your existing global CartContext that wraps the app layout
import { CartContext } from "../context/CartContext"; 

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Bridge all your card methods directly to the unified global system
  return {
    cart: {
      items: context.items || [],
      totalItems: (context.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0),
      totalAmount: (context.items || []).reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0),
    },
    addItem: context.addItem,
    removeItem: context.removeItem,
    clearCart: context.clearCart || (() => {}),
  };
}
