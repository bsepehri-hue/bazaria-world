"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, ShieldCheck } from "lucide-react";

interface ProductProps {
  id: string;
  title: string;
  price: number; // Value in standard fiat units (USD)
  category: string;
  description: string;
  image: string;
  ownerId: string;
}

export function ProductDisplay({
  id,
  title,
  price,
  category,
  description,
  image,
  ownerId,
}: ProductProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // 🛡️ BAZARIA VALIDATION: Prevent empty keys from being added to the state
    if (!id || !title || !price) {
      alert("Asset validation error. Please refresh and try again.");
      return;
    }

 addItem({
      id: props.product_code || props.xid || id || "missing_ledger_link", // ⚡ Targets props data mapping directly
      title,
      price,
      category,
      image,
      quantity: 1,
      ownerId: ownerId || "steward_node",
      name: title 
    });
    
    alert(`${title} added to cart.`);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "2rem",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
      }}
      className="group hover:shadow-2xl hover:-translate-y-1"
    >
      {/* 🖼️ Card Image Header */}
      <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          backgroundColor: "#ffffff",
          padding: "6px 12px",
          borderRadius: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <span style={{ fontSize: "8px", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", color: "#014d4e" }}>
            {category}
          </span>
        </div>
      </div>

      {/* 📝 Content Area */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: "1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", lineHeight: "1.3" }}>
            {title}
          </h3>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <Heart size={16} />
          </button>
        </div>

        <p style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.6", marginBottom: "24px", flexGrow: "1" }}>
          {description}
        </p>

        {/* 💲 Price Box */}
        <div style={{
          backgroundColor: "#f8fafc",
          padding: "16px",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <div>
            <span style={{ display: "block", fontSize: "8px", fontWeight: "900", textTransform: "uppercase", color: "#64748b", marginBottom: "2px" }}>
              Purchase Value
            </span>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "#014d4e" }}>
              ${price.toFixed(2)} <span style={{ fontSize: "10px", color: "#94a3b8" }}>USD</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#014d4e" }}>
            <ShieldCheck size={14} />
            <span style={{ fontSize: "8px", fontWeight: "900", textTransform: "uppercase" }}>Verified</span>
          </div>
        </div>

        {/* 🛒 Add to Cart / Checkout Trigger */}
        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            backgroundColor: "#014d4e",
            color: "#ffffff",
            border: "none",
            padding: "16px",
            borderRadius: "14px",
            fontSize: "10px",
            fontWeight: "900",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.3s"
          }}
          className="hover:bg-[#023334]"
        >
          <ShoppingCart size={14} /> Add to Order
        </button>
      </div>
    </div>
  );
}
