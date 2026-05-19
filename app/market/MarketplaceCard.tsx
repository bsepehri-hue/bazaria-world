"use client";

import React, { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiMapPin, FiShield, FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/app/providers/AuthProvider"; 
import { getProductCode } from "@/lib/utils";

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
    userId
  } = props;

 // --- 🏠 REAL ESTATE DATA RECOVERY GATES ---
  // Force numeric properties to strings so they are 100% render-safe in JSX elements
  const finalBeds = beds !== undefined && beds !== null ? String(beds) : (bedrooms !== undefined && bedrooms !== null ? String(bedrooms) : '0');
  const finalBaths = baths !== undefined && baths !== null ? String(baths) : (bathrooms !== undefined && bathrooms !== null ? String(bathrooms) : '0');

  const hasBeds = Number(finalBeds) > 0;
  const hasBaths = Number(finalBaths) > 0;

  // 🏷️ Product code extraction chain
  const productXid = props.listing?.xid_chain?.self
    ? getProductCode(props.listing.xid_chain.self)
    : `XID-${(id || props.id || "GEN").toString().substring(0, 5).toUpperCase()}`;

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

  const isServiceOrPet = rawCat.includes('service') || 
                         rawCat.includes('clean') || 
                         rawCat.includes('pet') || 
                         rawCat.includes('rare') ||
                         rawCat.includes('pro') || 
                         rawCat.includes('maintenance') ||
                         rawCat.includes('listing') || 
                         rawCat === '';

  // --- 🏠 MASTER PROPERTY CLASSIFICATION GATE ---
  // Uses clean exact string matching terms to verify properties without letting 'apartments' collide with 'art'
  const propertyKeywords = ['property', 'properties', 'homes', 'home', 'residential', 'apartment', 'apartments', 'villas', 'villa', 'land', 'caribbean'];

  const isPropertyAsset = 
    !isServiceOrPet && (
      propertyKeywords.some(token => rawCat === token || rawSubCat === token) ||
      hasBeds || 
      hasBaths
    );

  // 🛡️ MOBILITY INTERLOCK BALANCER (Isolates luxury assets from car metrics)
  let isMobilityAsset = false;

  const isExplicitGeneralAsset = rawCat === 'art' || 
                                 rawCat === 'sculpture' ||
                                 rawCat.includes('watch') || 
                                 rawCat.includes('apparel') || 
                                 rawCat.includes('clothing') || 
                                 rawCat.includes('furniture') || 
                                 rawCat.includes('electronics') ||
                                 rawCat.includes('misc') ||
                                 rawSubCat === 'art' ||
                                 rawSubCat.includes('watch') ||
                                 rawSubCat.includes('jacket') ||
                                 rawSubCat.includes('jewelry');

  if (!isPropertyAsset && !isServiceOrPet && !isExplicitGeneralAsset) {
    const hasMobilityKeywords = rawCat.includes('mobility') || 
                                 rawCat.includes('truck') || 
                                 rawCat.includes('rv') || 
                                 rawCat.includes('motorcycle') ||
                                 rawCat.includes('heavy') || 
                                 rawCat.includes('logistics') ||
                                 /\bcar\b/i.test(rawCat) || 
                                 /\bauto\b/i.test(rawCat);

    if (hasMobilityKeywords) {
      isMobilityAsset = true;
    }
  }

  if (rawCat.includes('listing') || rawCat.includes('general') || isExplicitGeneralAsset) {
    isMobilityAsset = false;
  }

  // ⏱️ TIME REMAINING CALCULATION
  const getDetailedTimeLeft = (endTime: any, fallback?: any) => {
    let targetTime = endTime || fallback;

    if (targetTime && typeof targetTime === 'object' && targetTime.seconds) {
      targetTime = targetTime.seconds * 1000;
    }

    if (targetTime) {
      const targetDate = new Date(targetTime);
      if (!isNaN(targetDate.getTime())) {
        const difference = targetDate.getTime() - Date.now();
        
        if (difference > 0) {
          const totalHours = Math.floor(difference / (1000 * 60 * 60));
          const days = Math.floor(totalHours / 24);
          const hours = totalHours % 24;
          const minutes = Math.floor((difference / 1000 / 60) % 60);

          if (days > 0) {
            return `${days}d ${hours}h left`;
          }
          return `${hours}h ${minutes}m left`;
        } else {
          return "Ended";
        }
      }
    }

    if (typeof fallback === 'string' && fallback.trim() !== "" && !fallback.includes("NaN")) {
      return fallback;
    }

    const currentContextCat = (props.category || props.type || "").toString().toLowerCase();
    let defaultDurationDays = 3;

    if (currentContextCat.includes('property') || currentContextCat.includes('homes') || currentContextCat.includes('villa')) {
      defaultDurationDays = 30;
    } else if (currentContextCat.includes('mobility') || currentContextCat.includes('auto')) {
      defaultDurationDays = 7;
    }

    if (props.createdAt || props.timestamp) {
      let createdTime = props.createdAt || props.timestamp;
      if (typeof createdTime === 'object' && createdTime.seconds) {
        createdTime = createdTime.seconds * 1000;
      }
      
      const expiryTime = new Date(createdTime).getTime() + (defaultDurationDays * 24 * 60 * 60 * 1000);
      const difference = expiryTime - Date.now();

      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        const minutes = Math.floor((difference / 1000 / 60) % 60);

        if (days > 0) {
          return `${days}d ${hours}h left`;
        }
        return `${hours}h ${minutes}m left`;
      }
    }

    return "Ended";
  };

  const [liveTime, setLiveTime] = useState(timeLeft);

  useEffect(() => {
    const updateTimer = () => {
      const explicitTime = props.endsAt || props.endTime;
      const calculated = getDetailedTimeLeft(explicitTime, timeLeft);
      const stringResult = Array.isArray(calculated) ? String(calculated[0]) : String(calculated);
      setLiveTime(stringResult);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [props.endsAt, props.endTime, timeLeft]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert("Identity Verification Required. Redirecting to access portal.");
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    addItem({
      id,
      name: cardName,
      price: displayPrice,
      quantity: 1,
      image: cardImage,
      sellerAddress,
    });
    alert(`${cardName} added to cart!`);
  };

  const handlePlaceBid = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("Identity Verification Required to Place Bid. Redirecting to access portal.");
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (onBid) {
      onBid();
    } else {
      router.push(`/market/asset/${id}`);
    }
  };

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

      {/* 🚨 PASTE THE QUICK DATA DIAGNOSTIC STRIP DIRECTLY HERE: */}
      <div style={{ backgroundColor: '#fee2e2', padding: '8px', fontSize: '9px', color: '#991b1b', fontWeight: 'bold', fontFamily: 'monospace', borderRadius: '8px', margin: '10px', textAlign: 'left' }}>
        PROP: {category} | SUB: {subCategory} | BEDS: {String(beds)} | BEDROOMS: {String(bedrooms)} | LIST_BEDS: {String(props.listing?.bedrooms)}
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
          {(isPropertyAsset || isMobilityAsset) && (
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
              <div 
                title="Click to select and copy X-ID"
                style={{ 
                  fontSize: "11px", 
                  fontFamily: "monospace", 
                  fontWeight: "900", 
                  color: "#FFBF00", 
                  backgroundColor: "#05292e", 
                  border: "1px solid #FFBF00",
                  padding: "3px 8px", 
                  borderRadius: "4px",
                  display: "inline-block",
                  letterSpacing: "0.5px",
                  marginBottom: "6px", 
                  cursor: "text", 
                  userSelect: "all", 
                  WebkitUserSelect: "all"
                }}
                onClick={(e) => {
                  e.stopPropagation(); 
                }}
              >
                {(() => {
                  try {
                    const rawXid = props?.listing?.xid_chain?.self || props?.xid_chain?.self;
                    if (rawXid) {
                      const parts = rawXid.split("-");
                      return `XID-${(parts[parts.length - 1] || "GEN").toUpperCase()}`;
                    }
                    const fallbackId = id || props?.id || props?.listing?.id || "GEN";
                    return `XID-${fallbackId.toString().substring(0, 5).toUpperCase()}`;
                  } catch (err) {
                    return "XID-GEN";
                  }
                })()}
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
                } else if (isMobilityAsset) {
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
