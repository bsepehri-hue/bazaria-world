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

export default function CheckoutForm({ orderTotal, packageDetails, merchantAddress }: CheckoutFormProps) {
  // Shipping Option States
  const [wantsShipping, setWantsShipping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
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

  // Calculate Shipping when address changes, or if user toggles Shipping back ON
  useEffect(() => {
    const isAddressComplete = 
      buyerAddress.street && 
      buyerAddress.city && 
      buyerAddress.state && 
      buyerAddress.zip;

    if (wantsShipping && isAddressComplete) {
      calculateShipping();
    } else if (!wantsShipping) {
      setShippingCost(0);
      setConvenienceFee(0);
      setError(null);
    }
  }, [wantsShipping, buyerAddress.street, buyerAddress.city, buyerAddress.state, buyerAddress.zip]);

  const calculateShipping = async () => {
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
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShippingCost(data.baseRate);
        setConvenienceFee(data.convenienceFee);
      } else {
        setError(data.details?.RateResponse?.Response?.Error?.Description || "Could not retrieve shipping quote.");
      }
    } catch (err) {
      console.error("Error fetching shipping quote:", err);
      setError("Failed to connect to the shipping calculator.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerAddress((prev) => ({ ...prev, [name]: value }));
  };

  const finalTotal = orderTotal + shippingCost + convenienceFee;

  return (
   <div 
  className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto px-4 py-8 text-white" 
  style={{ border: "5px solid red", padding: "50px" }}
>
      
      {/* 📦 LEFT SIDE: Address Information Form */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Delivery Details</h2>
        
        {/* Delivery Method Selector Checkbox */}
        <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl mb-6">
          <div className="flex-1 pr-4">
            <label className="font-semibold block text-base text-teal-400">Ship via UPS Ground</label>
            <span className="text-xs text-slate-400 mt-1 block">Delivered directly to your door with real-time tracking + $5 handling.</span>
          </div>
          <input
            type="checkbox"
            checked={wantsShipping}
            onChange={(e) => setWantsShipping(e.target.checked)}
            className="h-6 w-6 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-950 cursor-pointer"
          />
        </div>

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
                  <span>UPS Ground Cost</span>
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
            disabled={loading || (wantsShipping && shippingCost === 0 && !error)}
            className="mt-6 w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors rounded-xl font-bold text-slate-950 shadow-lg shadow-teal-500/10"
          >
            {loading ? "Calculating Live Rates..." : "Authorize Escrow & Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
