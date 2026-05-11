import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function TestShippingPage() {
  // Mock Merchant Warehouse (Where the package starts)
  const sampleMerchantAddress = {
    name: "Bazaria Storefront",
    street: "501 NW 26th St", // Wynwood, Miami
    city: "Miami",
    state: "FL",
    zip: "33127",
    country: "US"
  };

  // Mock Physical Item Dimensions (e.g., a pair of premium sneakers)
  const samplePackage = {
    weight: 4.5, // 4.5 lbs
    length: 12,  // 12 inches
    width: 10,   // 10 inches
    height: 4    // 4 inches
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          📦 Shipping Integration Sandbox
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Testing real-time UPS rating calculations and delivery method toggles.
        </p>
      </div>

      <CheckoutForm 
        orderTotal={120.00} 
        packageDetails={samplePackage} 
        merchantAddress={sampleMerchantAddress} 
      />
    </div>
  );
}
