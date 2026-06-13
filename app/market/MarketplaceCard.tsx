"use client";

import React, { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiMapPin, FiShield, FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext"; //
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/app/providers/AuthProvider"; 
import { getProductCode } from "@/lib/utils";
import { isListingInRegistry } from "@/lib/marketTaxonomy";

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

export function MarketplaceCard(props: any) {
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
    subCategory,
    location,
    isLiveAuction = false,
    isOwner = true,
    timeLeft,
    onBid,
    userId,
    // ⚓ EXTENSION: INTAKE EXPLICIT ATTRIBUTE EXTRACTIONS FROM PROPS HOOKS
    lengthFeet,
    engineDetails
  } = props;

// --- 🏠 BULLETPROOF DATA EXTRACTION CORE ---
  // 1. Gather all potential structural sources for engine details and running text fields
  const activeEngineString = 
    props.engineDetails || 
    engineDetails || 
    props.listing?.engineDetails || 
    props.listing?.engineConfiguration || 
    "";

  const activeLength = 
    props.lengthFeet || 
    lengthFeet || 
    props.listing?.lengthFeet || 
    props.listing?.length || 
    "---";

  // 2. Gather all primary numeric mileage keys across both top-level and nested tracks
  let rawMileage = 
    props.mileage || 
    mileage || 
    props.listing?.mileage || 
    props.hours || 
    props.listing?.hours ||
    0;

  // 3. ⚓ MARITIME EXTENSION FALLBACK: Directly parse strings if it belongs to the marine vertical
  const rawCatCheck = (category || type || props.category || "").toString().toLowerCase().trim();
  const rawIsMarine = rawCatCheck === "marine" || isListingInRegistry(props, "marine");

  if (rawIsMarine && (rawMileage === 0 || rawMileage === "0" || !rawMileage) && activeEngineString) {
    // Regex safely extracts the first set of digits it encounters inside the string sequence
    const textMatch = String(activeEngineString).match(/\d+/);
    if (textMatch) {
      rawMileage = parseInt(textMatch[0], 10);
    }
  }

  const activeMileage = rawMileage;

  const activeBeds = props.bedrooms || props.beds || bedrooms || beds || props.listing?.bedrooms || props.listing?.beds || '0';
  const activeBaths = props.bathrooms || props.baths || bathrooms || baths || props.listing?.bathrooms || props.listing?.baths || '0';

  const finalBeds = String(activeBeds);
  const finalBaths = String(activeBaths);

  const hasBeds = Number(finalBeds) > 0;
  const hasBaths = Number(finalBaths) > 0;

  
  // 🏷️ Clean Product code extraction chain: Preserves the pure raw data string
  const rawProductCode = props.listing?.xid_chain?.self
    ? getProductCode(props.listing.xid_chain.self)
    : (id || props.id || "OFVU0NXS9TKXNZXQPZLC").toString();

  // 🧼 Aggressively strip any legacy "XID-" prefixes and keep the raw token intact
  const databaseAssetID = rawProductCode
    .replace(/^XID-/i, '')
    .toUpperCase()
    .trim();

  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth(); 

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

  const hasAuctionPrice = pCurrent > 0 || pStart > 0 || (category && category.toLowerCase().includes("auction"));
  const isAuction = isLiveAuction || hasAuctionPrice;

  let displayPrice = isAuction 
    ? (pCurrent || pStart || pBase || pReserve) 
    : (pBuyNow || pBase || pReserve);

  if (displayPrice === 0) {
    displayPrice = pBuyNow || pCurrent || pStart || pBase || pReserve || 0;
  }

  // 🏷️ SANITIZED STRING TOKENS
  const rawCat = (category || type || "").toString().toLowerCase().trim();
  const rawSubCat = (subCategory || props.subCategory || "").toString().toLowerCase().trim();

 

 // 🛡️ CENTRAL TAXONOMY INTEGRITY CHECK
  // Force card layout frames to align 100% perfectly with your navigation tabs engine
  const isPropertyAsset = isListingInRegistry(props, "homes") || 
                          isListingInRegistry(props, "apartments") || 
                          isListingInRegistry(props, "villas") || 
                          isListingInRegistry(props, "caribbean") || 
                          isListingInRegistry(props, "land");

  const isMobilityAsset = !isPropertyAsset && (
                            isListingInRegistry(props, "mobility") || 
                            isListingInRegistry(props, "cars") ||
                            isListingInRegistry(props, "exotic - luxury") ||
                            isListingInRegistry(props, "electric vehicles (ev)") ||
                            isListingInRegistry(props, "trucks") ||
                            isListingInRegistry(props, "motorcycles") ||
                            isListingInRegistry(props, "rvs")
                          );

  // ⚓ EXTENSION: DETERMINE IF THE ACTIVE PAYLOAD IS A MARITIME ASSET TYPE
  const isMarineAsset = rawCat === "marine" || isListingInRegistry(props, "marine");

// ⏱️ TIME REMAINING CALCULATION
  const formatTimeLeft = (difference: number) => {
    const totalHours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    return days > 0 ? `${days}d ${hours}h left` : `${hours}h ${minutes}m left`;
  };

  const getDetailedTimeLeft = (endTime: any) => {
    let targetTime = endTime;
    if (targetTime && typeof targetTime === 'object' && targetTime.seconds) {
      targetTime = targetTime.seconds * 1000;
    }

    if (targetTime && !isNaN(new Date(targetTime).getTime())) {
      const diff = new Date(targetTime).getTime() - Date.now();
      return diff > 0 ? formatTimeLeft(diff) : "Ended";
    }

    const createdTimeRaw = props.createdAt || props.timestamp || Date.now();
    const createdTime = (typeof createdTimeRaw === 'object' && createdTimeRaw.seconds) 
      ? createdTimeRaw.seconds * 1000 
      : new Date(createdTimeRaw).getTime();

    const cat = (props.category || props.type || "general").toLowerCase();
    let daysToAdd = 3;
    if (cat.includes('property') || cat.includes('homes') || cat.includes('villa')) daysToAdd = 30;
    else if (cat.includes('mobility') || cat.includes('auto') || cat.includes('marine')) daysToAdd = 7;
    else if (cat.includes('digital')) daysToAdd = 3;

    const expiryTime = createdTime + (daysToAdd * 24 * 60 * 60 * 1000);
    const diff = expiryTime - Date.now();
    return diff > 0 ? formatTimeLeft(diff) : "Ended";
  };

  const [liveTime, setLiveTime] = useState(getDetailedTimeLeft(props.endsAt || props.endTime));

 // IMPROVED EFFECT: Smooth second-by-second countdown
  useEffect(() => {
    // 1. Calculate the target time ONCE when the component mounts or props change
    const target = props.endsAt || props.endTime;
    let targetTime: number;

    if (target && !isNaN(new Date(target).getTime())) {
      targetTime = new Date(target).getTime();
    } else {
      const createdTimeRaw = props.createdAt || props.timestamp || Date.now();
      const createdTime = (typeof createdTimeRaw === 'object' && createdTimeRaw.seconds) 
        ? createdTimeRaw.seconds * 1000 
        : new Date(createdTimeRaw).getTime();

      const cat = (props.category || props.type || "general").toLowerCase();
      let daysToAdd = 3;
      if (cat.includes('property') || cat.includes('homes') || cat.includes('villa')) daysToAdd = 30;
      else if (cat.includes('mobility') || cat.includes('auto') || cat.includes('marine')) daysToAdd = 7;
      
      targetTime = createdTime + (daysToAdd * 24 * 60 * 60 * 1000);
    }

    // 2. Interval updates every 1000ms (1 second) for smooth countdown
    const interval = setInterval(() => {
      const diff = targetTime - Date.now();
      
      if (diff <= 0) {
        setLiveTime("Ended");
        clearInterval(interval);
      } else {
        setLiveTime(formatTimeLeft(diff));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [props.endsAt, props.endTime, props.createdAt, props.timestamp, props.category, props.type]);

  // --- HANDLERS START HERE ---
  const handleAddToCart = (e: React.MouseEvent) => {
    // ... your add to cart logic ...
  };

  const handlePlaceBid = (e: React.MouseEvent) => {
    // ... your bid logic ...
  };

  // FINALLY, THE COMPONENT RETURN
  return (
    
    <div
      onClick={() => router.push(`/market/asset/${id}`)}
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
      {/* 🖼 MEDIA SECTION */}
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
            ⏱ {liveTime}
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
              const mId = merchantId || stewardID || sellerAddress || userId;
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

          {/* 🏗 ASSET SPECIFICATIONS BLOCK */}
          {(isPropertyAsset || isMobilityAsset || isMarineAsset) && (
            <div style={{ marginTop: "12px", marginBottom: "8px" }}>
              {isPropertyAsset ? (
                (hasBeds || hasBaths) && (
                  <div style={{ display: "flex", gap: "12px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                    <div>
                      <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Beds</p>
                      <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{finalBeds}</p>
                    </div>
                    <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "12px" }}>
                      <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Baths</p>
                      <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{finalBaths}</p>
                    </div>
                  </div>
                )
              ) : isMarineAsset ? (
  /* ⚓ EXTENSION: VERIFIED DYNAMIC WATERCRAFT BADGE ON CARD FACE */
  <div style={{ display: "flex", gap: "12px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
    <div>
      <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Length</p>
      <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
        {activeLength} {activeLength !== "---" ? "FT" : ""}
      </p>
    </div>
    <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "12px" }}>
      <p style={{ fontSize: "7px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Engine Hours</p>
      <p style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
        {activeMileage !== 0 ? `${Number(activeMileage).toLocaleString()} HRS` : "0 HRS"}
      </p>
    </div>
  </div>
) : (
                isMobilityAsset && (
                  (Number(mileage) > 0 || !!condition || !!props.make || !!props.model) && (
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
              {/* 🎯 UNIFIED PREMIUM VISUAL LABELLING AND CLIPBOARD HOVER */}
              <div 
                title={`Sovereign Ledger Anchor: ${databaseAssetID}\n(Click to copy raw code)`}
                onClick={(e) => {
                  e.stopPropagation(); // 🛡️ Prevents card container click from routing or opening detail views prematurely
                  navigator.clipboard.writeText(databaseAssetID);
                  alert(`Copied Code: ${databaseAssetID}`);
                }}
                style={{ 
                  backgroundColor: '#05292e', // 🌑 Dark backdrop back in place
                  color: '#FFBF00',           // ✨ Yellow/Gold text contrast
                  border: '1px solid #FFBF00', // 🧼 Subtle gold border framing
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: "9px", 
                  fontFamily: "monospace", 
                  fontWeight: "700",          // 🛠️ Dropped down one level from 900/1000 for cleaner contrast
                  letterSpacing: "1px",
                  padding: "4px 10px", 
                  borderRadius: "6px",
                  marginBottom: "6px",
                  textTransform: "uppercase"
                }}
                className="select-none hover:bg-[#07363d] transition-colors shadow-xs"
              >
                <span>XID CODE</span>
                <span style={{ fontSize: '8px', opacity: 0.8 }}>📋</span>
              </div>

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
                onClick={handlePlaceBid} 
                style={{
                  flex: 1,
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
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
                onClick={handleAddToCart} 
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                let targetPath = "general";
                if (isPropertyAsset) {
                  targetPath = "properties/residential";
                } else if (isMobilityAsset || isMarineAsset) {
                  // ⚓ Direct watercraft configurations to the mobility asset editing track layout
                  targetPath = "mobility";
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceCard;
