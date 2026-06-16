"use client";

import { useState } from "react";
import { executeBuyNow } from "@/utils/marketplaceService"; 

export default function BuyNowButton({ firebaseAssetId, usdcPrice }: any) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    console.log("Attempting to buy asset:", firebaseAssetId);
    setIsProcessing(true);
    try {
      // Direct call
      await executeBuyNow(firebaseAssetId, usdcPrice);
      alert("Purchase successful!");
    } catch (error) {
      console.error("DEBUG ERROR:", error);
      alert("Check the console for the error!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handlePurchase} 
      disabled={isProcessing}
      className="bg-blue-600 text-white p-4 rounded"
    >
      {isProcessing ? "Processing..." : "Buy Now for 10 USDC"}
    </button>
  );
}
