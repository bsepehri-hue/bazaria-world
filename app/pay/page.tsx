"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import { ShieldCheck, FileText, Printer, ArrowRight, CheckCircle2 } from "lucide-react";

// Simple Published Flat Pricing Matrix
const TARIFF_REGISTRY: Record<string, { name: string; price: number }> = {
  car: { name: "Automotive Verification & Listing", price: 10 },
  home: { name: "Real Estate Structural Auction Slot", price: 29 },
  heavy: { name: "Industrial Heavy Machinery Slot", price: 49 },
};

function PortableQuoteCheckout() {
  const searchParams = useSearchParams();

  // 1. Pull simple variables out of the portable text link string
  const agentId = searchParams.get("agent") || "SYSTEM_DIRECT";
  const itemType = searchParams.get("item") || "car";
  const assetTitle = searchParams.get("title") || "Standard Asset Clearance";
  
  // 2. Instantly calculate line items dynamically based on the text link parameters
  const activeTariff = TARIFF_REGISTRY[itemType] || TARIFF_REGISTRY.car;
  const platformFee = 2.00; // Standard processing buffer line item
  const finalTotal = activeTariff.price + platformFee;

  const initiateSecureStripeRoute = (e: React.FormEvent) => {
    e.preventDefault();
    // Next week: We hook this line directly into Stripe Checkout URL redirect.
    alert(`Redirecting to Secure Stripe Server...\nProcessing: $${finalTotal.toFixed(2)}\nAgent Credit: ${agentId}`);
  };

  return (
    <div className="max-w-[850px] mx-auto bg-[#05292e] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      
      {/* Upper Brand Slate */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-[#05292e] to-[#021a1d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#C5A059] tracking-widest uppercase block mb-1">
            Official Broker Solution Estimate
          </span>
          <h1 className="text-xl font-black uppercase text-white tracking-wide m-0">
            Order Quote / Statement
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-[#021a1d] border border-white/5 px-4 py-2 rounded-xl">
          <span className="text-[11px] text-[#94a3b8] font-bold uppercase">Broker ID:</span>
          <span className="text-[12px] text-[#C5A059] font-mono font-black uppercase">{agentId}</span>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
        
        {/* LEFT COMPONENT: ITEMIZED INVOICE SLATE */}
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-black text-[#94a3b8] uppercase block mb-2">Target Asset Context</span>
            <div className="bg-[#021a1d] p-4 rounded-xl border border-white/5">
              <span className="text-[11px] text-[#C5A059] font-mono block mb-1 uppercase">Vetting Description</span>
              <div className="text-sm font-bold text-white uppercase tracking-wide">{assetTitle.replace(/-/g, " ")}</div>
            </div>
          </div>

          {/* Clean Line Items (The Broken-Down Breakdown) */}
          <div>
            <span className="text-[11px] font-black text-[#94a3b8] uppercase block mb-3">Itemized Billing Allocations</span>
            <div className="space-y-2">
              
              {/* Line 1: Main Base Asset Price */}
              <div className="flex justify-between items-center bg-[#021a1d]/40 px-4 py-3 rounded-lg border border-white/[0.02]">
                <span className="text-xs text-slate-300 font-medium">{activeTariff.name}</span>
                <span className="text-xs font-mono font-bold text-white">${activeTariff.price.toFixed(2)}</span>
              </div>

              {/* Line 2: Fixed Processing Fee */}
              <div className="flex justify-between items-center bg-[#021a1d]/40 px-4 py-3 rounded-lg border border-white/[0.02]">
                <span className="text-xs text-slate-400 font-medium">Compliance & Verification Stamp Fee</span>
                <span className="text-xs font-mono font-bold text-white">${platformFee.toFixed(2)}</span>
              </div>

            </div>
          </div>

          <button 
            type="button" 
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5"
          >
            <Printer size={13} /> Print/Save Portable Copy
          </button>
        </div>

        {/* RIGHT COMPONENT: ISOLATED ACTION BILLING LOCK BOX */}
        <div className="bg-[#021a1d] p-6 rounded-xl border border-white/5 flex flex-col justify-between min-height-[280px]">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#10b981] tracking-wider uppercase mb-4">
              <CheckCircle2 size={12} /> Secure Order Link
            </div>
            <span className="text-[11px] text-[#94a3b8] uppercase font-bold block">Total Amount Due</span>
            <div className="text-4xl font-black text-white font-mono mt-1">${finalTotal.toFixed(2)}</div>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
              Funds are held securely under our corporate clearing layer. Listing activation occurs instantly post-authorization.
            </p>
          </div>

          <button
            onClick={initiateSecureStripeRoute}
            className="w-100 mt-6 bg-[#C5A059] text-[#021a1d] border-none font-black text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white hover:scale-[1.01]"
          >
            Proceed to Stripe Pay <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Trust Isolation Footer */}
      <div className="bg-[#021a1d]/50 px-8 py-4 border-t border-white/5 flex items-center gap-2.5 text-[11px] text-[#94a3b8]">
        <ShieldCheck size={14} color="#C5A059" />
        <span>**Security Isolation Guard:** Agents do not have visibility into credit profiles or clearing parameters.</span>
      </div>
    </div>
  );
}

export default function PortablePayConsole() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff" }}>
      <TopNav />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <Suspense fallback={<div className="text-center text-xs uppercase text-[#C5A059] font-black tracking-widest py-20">Parsing Link Parameters...</div>}>
          <PortableQuoteCheckout />
        </Suspense>
      </div>
    </div>
  );
}
