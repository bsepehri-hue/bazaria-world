"use client";

import React from "react";
import { 
  FiShoppingCart, 
  FiEye, 
  FiEdit2, 
  FiMapPin, 
  FiShield, 
  FiShoppingBag 
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

function GavelIcon(props: { size?: number }) {
  const size = props.size || 14;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m14.5 9-7.5 7.5" />
      <path d="m18.5 5-4.5 4.5" />
      <path d="m8.5 13-4.5 4.5" />
      <path d="M3 21h18" />
      <path d="M16 3a2.5 2.5 0 1 1 3.5 3.5L8.5 17.5l-4.5-4.5L16 3Z" />
    </svg>
  );
}

export interface ItemProps {
  id: string;
  title?: string;
  name?: string;
  price?: number | string;
  reservePrice?: number | string;
  buyPrice?: number | string;
  buyNowPrice?: number | string;
  startingBid?: number | string;
  currentBid?: number | string;
  description: string;
  narrative?: string;
  story?: string;
  image?: string;
  imageUrl?: string;
  sellerAddress?: string;
  merchantId?: string;
  stewardID?: string;
  merchantName?: string;
  beds?: number | string;
  baths?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  mileage?: number | string;
  mileageUnit?: string;
  condition?: string;
  type?: string;
  category?: string;
  location?: string;
  isLiveAuction?: boolean;
  isOwner?: boolean;
  endsAt?: string | number;
  timeLeft?: string;
  make?: string;
  model?: string;
  onBid?: () => void;
  userId?: string;
}

export function ItemCard(props: ItemProps) {
  const {
    id,
    title,
    name,
    price,
    reservePrice,
    buyPrice,
    buyNowPrice,
    startingBid,
    currentBid,
    description,
    narrative,
    story,
    image,
    imageUrl,
    sellerAddress,
    merchantId,
    stewardID,
    merchantName,
    beds,
    baths,
    bedrooms,
    bathrooms,
    mileage,
    mileageUnit,
    condition,
    type,
    category,
    location,
    isLiveAuction = false,
    isOwner = false,
    timeLeft,
    onBid,
  } = props;

  const router = useRouter();
  const { addItem } = useCart();

  const cardName = title || name || "Listing";
  const cardDescription = description || narrative || story || "";
  const cardImage = image || imageUrl || "";

  // 💰 PRICE LOGIC
  const getSafeNumber = (val: any): number => {
    if (val === undefined || val === null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const pBuyNow = getSafeNumber(buyNowPrice || buyPrice || props.buyNowPrice || props.buyPrice);
  const pCurrent = getSafeNumber(currentBid || props.currentBid);
  const pStart = getSafeNumber(startingBid || props.startingBid);
  const pBase = getSafeNumber(price || props.price);
  const pReserve = getSafeNumber(reservePrice || props.reservePrice);

  const isAuction = isLiveAuction || pCurrent > 0 || pStart > 0 || (category && category.toLowerCase().includes("auction"));

  let displayPrice = isAuction 
    ? (pCurrent || pStart || pBase || pReserve) 
    : (pBuyNow || pBase || pReserve);

  if (displayPrice === 0) {
    displayPrice = pBuyNow || pCurrent || pStart || pBase || pReserve || 0;
  }

  // 🎯 PURE DATABASE IDENTITY: No cutting, no formatting, no zero-padding. Clean source of truth!
  const databaseAssetID = (props.card?.product_code || props.card?.xid || props.card?.id || props.product_code || id || "OFVU0NXS9TKXNZXQPZLC")
    .toString().toUpperCase().trim();

  // ⚡ Extracting your context hooks safely
  const { addItem, setIsCartOpen } = useCart();

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🛡️ Stops the click from routing you to the asset detail page immediately

    // ⚡ 1. Commit the pure raw hash directly to the global cart state array
    addItem({
      id: databaseAssetID, // 🔒 Stored as pure key (e.g., "OFVU0NXS9TKXNZXQPZLC")
      name: cardName,
      price: displayPrice,
      quantity: 1,
      image: cardImage,
      sellerAddress: sellerAddress || "steward_node",
      title: cardName, 
      ownerId: sellerAddress || stewardID || merchantId || "steward_node" 
    });

    // ⚡ 2. Sync layout events natively
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-updated"));

    // ⚡ 3. Open your sliding cart ledger immediately so the user sees the item land!
    if (typeof setIsCartOpen === "function") {
      setIsCartOpen(true);
    }
  };

  return (
    <div
      onClick={() => router.push(`/market/asset/${databaseAssetID}`)}
      style={{
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: "350px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
        margin: "10px",
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >

      {/* 🖼️ MEDIA / THUMBNAIL SECTION */}
      <div
        style={{
          height: "200px",
          position: "relative",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: 'absolute', 
          top: '12px', 
          left: '12px', 
          backgroundColor: isAuction ? 'rgba(255, 191, 0, 0.95)' : 'rgba(1, 77, 78, 0.95)', 
          color: isAuction ? '#014d4e' : '#ffffff',
          padding: '6px 12px', 
          borderRadius: '10px', 
          fontSize: '9px', 
          fontWeight: '900', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          zIndex: 10
        }}>
          {isAuction ? <GavelIcon size={11} /> : <FiShoppingBag size={11} />}
          {isAuction ? 'LIVE AUCTION' : 'DIRECT BUY'}
        </div>

        {isAuction && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '6px 10px',
            borderRadius: '10px',
            fontSize: '9px',
            fontWeight: '900',
            color: '#0f172a',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            ⏱️ {timeLeft || "24h left"}
          </div>
        )}

        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {cardImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cardImage} alt={cardName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <FiShoppingBag size={32} />
              <span style={{ fontSize: "10px" }}>No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* 📄 CONTENT SECTION */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", gap: "6px" }}>
        <div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", width: "fit-content", marginBottom: "6px" }}
            onClick={(e) => {
              e.stopPropagation();
              const mId = merchantId || stewardID || props.sellerAddress || props.userId;
              if (mId) router.push(`/storefront/${mId}`);
            }}
            title="Visit Merchant Storefront"
          >
            <FiShield size={10} color="#14b8a6" />
            <span style={{ fontSize: "8px", fontWeight: 900, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
              {merchantName || "Protocol"} • BAZARIA VERIFIED
            </span>
          </div>

          <h3 style={{ margin: "2px 0", fontSize: "16px", fontWeight: 900, color: "#0f172a", textTransform: "uppercase" }}>
            {cardName}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#94a3b8", fontWeight: "700", marginTop: "4px" }}>
            <FiMapPin size={10} /> {location || "Global Protocol"}
          </div>

          {/* 🏗️ ASSET SPECIFICATIONS BLOCK */}
          {(isPropertyAsset || isMobilityAsset) && (
            <div style={{ marginTop: "12px", marginBottom: "8px" }}>
              {isPropertyAsset ? (
                <div style={{ display: "flex", gap: "12px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                  <div>
                    <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Beds</p>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{bedrooms || beds || '0'}</p>
                  </div>
                  <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "12px" }}>
                    <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Baths</p>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{bathrooms || baths || '0'}</p>
                  </div>
                </div>
              ) : (
                isMobilityAsset && (
                  <div style={{ display: "flex", gap: "12px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                    <div>
                      <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Usage</p>
                      <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                        {Number(mileage || 0).toLocaleString()} {mileageUnit || 'MI'}
                      </p>
                    </div>
                    {condition && (
                      <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "12px" }}>
                        <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Condition</p>
                        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#014d4e", margin: 0 }}>
                          {String(condition).includes('/') ? String(condition).split("/").pop() : condition}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          <p style={{ margin: "6px 0 0 0", fontSize: "10px", color: "#64748b", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {cardDescription}
          </p>
        </div>

        {/* 💰 PRICING & ACTION SECTION */}
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
            <div>
              <p style={{ fontSize: "8px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", marginBottom: "2px" }}>
                {isAuction ? "Current Bid" : "Retail Price"}
              </p>
              <p style={{ fontSize: "20px", fontWeight: 900, color: "#014d4e", margin: 0, letterSpacing: "-1px" }}>
                ${displayPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            {isAuction ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onBid) onBid();
                  else router.push(`/market/asset/${id}`);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#FFBF00",
                  color: "#004d40",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 0",
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
Place Bid
        </button>
      ) : (
        <button
          onClick={handleAddToCartClick} // ⚡ CONNECTED TO YOUR NEW CLEAN RAW-IDENTITY FUNCTION
          style={{
            flex: 1,
            backgroundColor: "#014d4e",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 0",
            fontSize: "9px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px"
          }}
        >
          Buy Now
        </button>
      )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/market/asset/${id}`);
              }}
              style={{
                backgroundColor: "#f1f5f9",
                color: "#334155",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FiEye size={12} />
            </button>
            
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  let targetPath = "general";
                  if (isPropertyAsset) {
                    targetPath = "properties/residential";
                  } else if (isMobilityAsset) {
                    targetPath = "mobility";
                  } else {
                    targetPath = "general";
                  }
                  router.push(`/market/create/${targetPath}?edit=${id}`);
                }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  color: "#0f172a",
                  gap: "4px"
                }}
              >
                <FiEdit2 size={10} color="#004d40" /> Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
