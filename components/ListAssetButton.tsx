"use client";

import { useState } from "react";
import { executeListAsset } from "@/utils/marketplaceService"; 

export default function ListAssetButton({ firebaseAssetId, buyNowPrice, reservePrice }: any) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleListing = async () => {
    setIsProcessing(true);
    try {
      const receipt = await executeListAsset(firebaseAssetId, buyNowPrice, reservePrice);
      alert(`Asset officially on-chain! Tx: ${receipt.hash}`);
      // Here you would do the reverse of the Buy flow: 
      // Call an API to update Firebase setting `active: true`
    } catch (error) {
      console.error(error);
      alert("Failed to list asset.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleListing} 
      disabled={isProcessing}
      className="bg-purple-600 text-white px-6 py-2 rounded font-bold"
    >
      {isProcessing ? "Confirming on Blockchain..." : "Publish to Marketplace"}
    </button>
  );
}
