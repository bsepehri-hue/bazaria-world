import ListAssetButton from "@/components/ListAssetButton";
import BuyNowButton from "@/components/BuyNowButton";

export default function TestMarketplace() {
  // Hardcoded test variables
  const TEST_ASSET_ID = "TEST-XID-999";
  const TEST_PRICE_USDC = 50; // $50 USDC
  const TEST_RESERVE_USDC = 40; 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Dry Run</h1>
          <p className="text-gray-500">Testing isolated smart contract functions.</p>
        </div>

        {/* SELLER PANEL */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Phase 1: The Merchant</h2>
          <p className="text-sm text-purple-700 mb-4">
            Registers the item on-chain using the Marketplace contract. No USDC required.
          </p>
          <ListAssetButton 
            firebaseAssetId={TEST_ASSET_ID} 
            buyNowPrice={TEST_PRICE_USDC} 
            reservePrice={TEST_RESERVE_USDC} 
          />
        </div>

        {/* BUYER PANEL */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Phase 2: The Buyer</h2>
          <p className="text-sm text-blue-700 mb-4">
            Executes the two-step purchase. Triggers the USDC approval, then routes the 6% fee split.
          </p>
          <BuyNowButton 
            firebaseAssetId={TEST_ASSET_ID} 
            usdcPrice={TEST_PRICE_USDC} 
          />
        </div>

      </div>
    </div>
  );
}
