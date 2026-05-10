"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartStorage } from "./cartStorage";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  ownerId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartEmpty: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Only load from localStorage once mounted on the client
  useEffect(() => {
    setItems(cartStorage.get());
  }, []);

  // Save whenever items change
  useEffect(() => {
    if (items.length >= 0) {
      cartStorage.set(items);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const idx = current.findIndex((i) => i.id === item.id);
      
      if (idx > -1) {
        const copy = [...current];
        copy[idx].quantity += item.quantity || 1;
        return copy;
      }
      return [...current, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => (Array.isArray(prev) ? prev.filter((i) => i.id !== id) : []));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getCartTotal,
        isCartEmpty: items.length === 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
