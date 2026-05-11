"use client";

import { useState, useEffect } from "react";

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PackageDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface CheckoutFormProps {
  orderTotal: number;
  packageDetails: PackageDetails;
  merchantAddress: Address;
}

interface ShippingOption {
  serviceCode: string;
  serviceName: string;
  transitTime: string;
  baseRate: number;
  convenienceFee: number;
}

export default function CheckoutForm({ orderTotal, packageDetails, merchantAddress }: CheckoutFormProps) {
  const [wantsShipping, setWantsShipping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedServiceCode, setSelectedServiceCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Buyer Delivery Address State
  const [buyerAddress, setBuyerAddress] = useState<Address>({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  // 📦 Detect Oversized Package Logic
  // UPS considers packages "oversized" if weight > 150 lbs, or Length + Girth > 130 inches
  const girth = 2 * (packageDetails.width + packageDetails.height);
  const totalSize = packageDetails.length + girth;
  const isOversized = packageDetails.weight > 70 || totalSize > 108; // 70+ lbs starts triggering Air restrictions

  useEffect(() => {
    const isAddressComplete = 
      buyerAddress.street.trim() !== "" && 
      buyerAddress.city.trim() !== "" && 
      buyerAddress.state.trim() !== "" && 
      buyerAddress.zip.trim() !== "";

    if (wantsShipping && isAddressComplete) {
      fetchShippingRates();
    } else if (!wantsShipping) {
      setShippingOptions([]);
      setSelectedServiceCode("");
      setError(null);
    }
  }, [wantsShipping, buyerAddress.street, buyerAddress.city, buyerAddress.state, buyerAddress.zip]);

  const fetchShippingRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: merchantAddress,
          toAddress: buyerAddress,
          packageDetails,
          isOversized, // Pass flag to backend to request freight options if needed
        }),
      });

      const data = await response.json();
      if (data.success && data.rates) {
        setShippingOptions(data.rates);
        // Default to the first (typically cheapest) returned rate option
        if (data.rates.length > 0) {
          setSelectedServiceCode(data.rates[0].serviceCode);
        }
      } else {
        setError(data.error || "Could not retrieve shipping options.");
      }
    } catch (err) {
      console.error("Error fetching shipping rates:", err);
      setError("Failed to connect to the shipping calculator.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Find currently selected rate details
  const currentSelection = shippingOptions.find(opt => opt.serviceCode === selectedServiceCode);
  const shippingCost = currentSelection ? currentSelection.baseRate : 0;
  const convenienceFee = currentSelection ? currentSelection.convenienceFee : 0;
  const finalTotal = orderTotal + shippingCost + convenienceFee;

const handleCheckout = async () => {
  setLoading(true);
  try {
    const currentSelection = shippingOptions.find(opt => opt.serviceCode === selectedServiceCode);
    
    const payload = {
      listingId: "11111111-1111-1111-1111-111111111111", // Dummy listing
      stewardId: "22222222-2222-2222-2222-222222222222", // Dummy merchant
      buyerId: "33333333-3333-3333-3333-333333333333",   // Dummy user
      itemPriceInCents: orderTotal * 100, // $120.00 -> 12000 cents
      deliveryMethod: wantsShipping ? "SHIPPING" : "PICKUP",
      selectedRate: wantsShipping ? {
        baseRate: shippingCost,
        convenienceFee: convenienceFee
      } : null,
      packageDetails,
      buyerAddress
    };

    const response = await fetch("/api/test-db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) {
      alert(`🎉 Success! Simulated Order Logged.\nOrder ID: ${data.salesLogged.id}\nCheck your terminal console for the SQL query outputs!`);
    } else {
      alert("Something went wrong with the db simulation.");
    }
  } catch (err) {
    console.error(err);
    alert("Fail.");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto px-4 py-8 text-white">
      
      {/* 📦 LEFT SIDE: Address Information Form */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Delivery Details</h2>
        
        {/* Toggle Shipping vs Local Handoff */}
        <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl mb-6">
          <div className="flex-1 pr-4">
            <label className="font-semibold block text-base text-teal-400">Request Home Delivery</label>
            <span className="text-xs text-slate-400 mt-1 block">Toggle off if you prefer organizing a free physical local pickup.</span>
          </div>
          <input
            type="checkbox"
            checked={wantsShipping}
            onChange={(e) => setWantsShipping(e.target.checked)}
            className="h-6 w-6 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-950 cursor-pointer"
          />
        </div>

        {/* Oversize Notice Board */}
        {wantsShipping && isOversized && (
          <div className="mb-6 p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl flex items-start gap-3">
            <span className="text-amber-500 text-xl">⚠️</span>
            <div>
              <h5 className="font-bold text-amber-400 text-sm">Oversized Package Detected</h5>
              <p className="text-xs text-slate-300 mt-0.5">
                This item weighs **{packageDetails.weight} lbs** or has larger dimensions. Express air delivery is restricted. Ground Freight rates will apply.
              </p>
            </div>
          </div>
        )}

        {wantsShipping ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={buyerAddress.name}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={buyerAddress.street}
                onChange={handleInputChange}
                placeholder="123 Ocean Drive"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={buyerAddress.city}
                  onChange={handleInputChange}
                  placeholder="Miami"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={buyerAddress.state}
                  onChange={handleInputChange}
                  placeholder="FL"
                  maxLength={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zip"
                  value={buyerAddress.zip}
                  onChange={handleInputChange}
                  placeholder="33139"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={buyerAddress.country}
                  disabled
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-3 px-4 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* 🚀 NEW: Dynamic Shipping Method Selector */}
            {shippingOptions.length > 0 && (
              <div className="mt-8 border-t border-slate-900 pt-6">
                <h3 className="text-lg font-bold mb-4">Choose Shipping Speed</h3>
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.serviceCode}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedServiceCode === option.serviceCode
                          ? "bg-teal-950/20 border-teal-500/80 shadow-md shadow-teal-500/5"
                          : "bg-slate-900/30 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_service"
                          value={option.serviceCode}
                          checked={selectedServiceCode === option.serviceCode}
                          onChange={() => setSelectedServiceCode(option.serviceCode)}
                          className="h-4 w-4 border-slate-750 bg-slate-900 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-950 cursor-pointer"
                        />
                        <div>
                          <span className="font-semibold block text-sm">{option.serviceName}</span>
                          <span className="text-xs text-slate-400">{option.transitTime}</span>
                        </div>
                      </div>
                      <span className="font-bold text-teal-400">
                        ${(option.baseRate + option.convenienceFee).toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/20">
            <span className="text-3xl block mb-2">🤝</span>
            <h4 className="text-lg font-bold text-slate-200">Local Hand-off Selected</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              You will coordinate directly with the merchant to arrange a secure local pickup. Zero shipping fees applied.
            </p>
          </div>
        )}
      </div>

      {/* 💳 RIGHT SIDE: Order Summary & Checkout Action */}
      <div className="lg:col-span-5">
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl sticky top-8">
          <h2 className="text-xl font-bold tracking-tight mb-6">Order Summary</h2>

          {/* Pricing Breakdown */}
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex justify-between items-center w-full">
              <span>Subtotal</span>
              <span className="font-semibold text-white">${orderTotal.toFixed(2)}</span>
            </div>

            {wantsShipping && (
              <>
                <div className="flex justify-between items-center w-full">
                  <span>UPS Carrier Cost ({currentSelection?.serviceName || "Pending"})</span>
                  <span className="font-semibold text-white">
                    {loading ? (
                      <span className="animate-pulse text-teal-400">Calculating...</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="flex items-center gap-1.5">
                    Platform Convenience Fee
                    <span className="group relative cursor-pointer text-slate-500 text-xs bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-800">
                      ?
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 text-xs text-slate-300 p-2 rounded shadow-lg text-center z-10">
                        A flat fee for escrow and label generation.
                      </span>
                    </span>
                  </span>
                  <span className="font-semibold text-teal-400">${convenienceFee.toFixed(2)}</span>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <hr className="border-slate-900" />

            <div className="flex justify-between items-end text-white w-full">
              <div>
                <span className="text-sm block text-slate-400">Total Price</span>
                <span className="text-xs text-slate-500">Includes all local duties & handling</span>
              </div>
              <span className="text-2xl font-black text-teal-400">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

         <button
  onClick={handleCheckout}
  disabled={loading || (wantsShipping && shippingOptions.length === 0 && !error)}
  className="mt-6 w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors rounded-xl font-bold text-slate-950 shadow-lg shadow-teal-500/10"
>
  {loading ? "Processing..." : "Authorize Escrow & Order"}
</button>
        </div>
      </div>
    </div>
  );
}
