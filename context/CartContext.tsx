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
  
  // ⚡ Add these two lines to natively support the sovereign drawer state engine
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); 
  
  // ⚡ 1. ADD THE GLOBAL SIDEBAR VISIBILITY HOOK STATE
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // 1. Load from localStorage ONCE on mount
  useEffect(() => {
    const savedItems = cartStorage.get();
    if (savedItems && savedItems.length > 0) {
      setItems(savedItems);
    }
    setIsLoaded(true); 
  }, []);

  // 2. Only save to localStorage AFTER initial load is done
  useEffect(() => {
    if (isLoaded) {
      cartStorage.set(items);
    }
  }, [items, isLoaded]);

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

    // ⚡ INSTANT REACTIVE SYNC: Force the global drawer to slide open immediately on addition
    setIsCartOpen(true);

    // 📡 Broadcast natively to global layout components listening on storage channels
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const updated = current.filter((i) => i.id !== id);
      
      // 💾 FORCE PERSISTENCE: Write directly to your storage utility before returning the state
      cartStorage.set(updated);
      return updated;
    });

    // ⚡ INSTANT REACTIVE SYNC: Broadcast the change straight away without any setTimeout delay
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // ⚡ 2. UPDATE THE RETURN BLOCK VALUE EXPORT
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getCartTotal,
        isCartEmpty: items.length === 0,
        
        // ⚡ Exposing the layout states seamlessly to all buttons and headers
        isCartOpen,
        setIsCartOpen,
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
