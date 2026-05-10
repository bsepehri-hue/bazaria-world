"use client";

import { useState, useEffect } from "react";
import { CartItem, CartState } from "../types/cart";

const CART_STORAGE_KEY = "bazaria_cart";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

export function useCart() {
  const [cart, setCart] = useState<CartState>(initialState);

  // Load from localStorage on mount to persist across reloads
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure the parsed data matches the expected CartState shape
        if (parsed && Array.isArray(parsed.items)) {
          setCart(parsed);
        }
      } catch (e) {
        console.error("Failed to parse cart state:", e);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  const saveCart = (newCart: CartState) => {
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const addItem = (item: CartItem) => {
    // 🛡️ Safety check: Initialize a new array if cart.items is undefined/not iterable
    const newItems = Array.isArray(cart?.items) ? [...cart.items] : [];
    const existingIndex = newItems.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += item.quantity;
    } else {
      newItems.push(item);
    }

    const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    saveCart({ items: newItems, totalItems, totalAmount });
  };

  const removeItem = (id: string) => {
    const safeItems = Array.isArray(cart?.items) ? cart.items : [];
    const newItems = safeItems.filter((i) => i.id !== id);
    const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    saveCart({ items: newItems, totalItems, totalAmount });
  };

  const clearCart = () => {
    saveCart(initialState);
  };

  return {
    cart,
    addItem,
    removeItem,
    clearCart,
  };
}
