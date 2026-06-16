"use client";

import { useState } from "react";
// Import the function we wrote previously (adjust the path to where you saved it)
import { executeBuyNow } from "@/utils/marketplaceService"; 

interface BuyNowButtonProps {
  firebaseAssetId: string;
  usdcPrice: number;
}

export default function BuyNowButton({ firebaseAssetId, usdcPrice }: BuyNowButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    setStatusMessage("Please check MetaMask to approve the transaction...");
    setIsSuccess(false);

    try {
      // 1. Trigger the Ethers v6 logic
      const receipt = await executeBuyNow(firebaseAssetId, usdcPrice);
      
      // 2. Handle Success
      setStatusMessage(`Success! Transaction Hash: ${receipt.hash}`);
      setIsSuccess(true);
      
      // TODO: Add logic here to update your Firebase database 
      // so the item shows as "Sold" to other users.

    } catch (error: any) {
      // 3. Handle Errors (e.g., user rejected the transaction)
      console.error("Purchase failed:", error);
      
      if (error.code === "ACTION_REJECTED") {
        setStatusMessage("Transaction was cancelled in MetaMask.");
      } else {
        setStatusMessage("An error occurred during the transaction. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3 mt-4">
      <button
        onClick={handlePurchase}
        disabled={isProcessing || isSuccess}
        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
          isSuccess 
            ? "bg-green-600 text-white cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        }`}
      >
        {isProcessing ? "Processing..." : isSuccess ? "Purchased!" : `Buy Now for ${usdcPrice} USDC`}
      </button>

      {/* Status Feedback for the User */}
      {statusMessage && (
        <p className={`text-sm font-medium ${isSuccess ? "text-green-600" : "text-gray-700"}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
