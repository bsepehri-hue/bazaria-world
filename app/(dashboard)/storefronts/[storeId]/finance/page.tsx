"use client";

import React, { useState, useEffect, use } from "react";
import { db, auth } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  ArrowUpRight, 
  Percent, 
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

export default function StorefrontFinanceDashboard({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = use(params);

  // --- 1. STATE CONFIGURATION ---
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    liquidBalanceUSD: 0,      // Ready for extraction / withdrawn bounds
    escrowHoldsUSD: 0,        // Total locked inside 10% high-ticket deposits
    lifetimeVolumeUSD: 0,     // Total gross value transacted across lines
    platformFeesPaidUSD: 0,   // Accumulated take-rate splits captured by treasury
    overagePremiumsUSD: 0     // Total revenue cleared over reserve targets
  });
  const [historicalLedger, setHistoricalLedger] = useState<any[]>([]);

  // --- 2. AUTHENTICATION PROTECTION WATCHER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- 3. ANALYTICAL PROCESSING COMPILATION MATRIX ---
  useEffect(() => {
    async function compileFinancialLedger() {
      if (!storeId) return;
      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        const qOrders = query(ordersRef, where("storeId", "==", storeId));
        const snap = await getDocs(qOrders);

        let liquidAccumulator = 0;
        let escrowAccumulator = 0;
        let grossAccumulator = 0;
        let feesAccumulator = 0;
        let overageAccumulator = 0;
        const ledgerRows: any[] = [];

        snap.docs.forEach((docSnapshot) => {
          const order = docSnapshot.data();
          const priceUSD = order.totalPriceUSD || 0;
          const isHighTicket = priceUSD >= 5000;
          const reservePriceUSD = order.reservePriceUSD || priceUSD;
          const overageDelta = Math.max(0, priceUSD - reservePriceUSD);

          grossAccumulator += priceUSD;

          // Compute operational transaction distributions
          let calculatedFee = 0;
          let calculatedNet = 0;

          if (!isHighTicket) {
            calculatedFee = priceUSD * 0.06;
            calculatedNet = priceUSD - calculatedFee;
            
            if (order.status === "completed") {
              liquidAccumulator += calculatedNet;
            }
          } else {
            const baseDepositFee = reservePriceUSD * 0.10;
            const performanceOverageFee = overageDelta * 0.15;
            calculatedFee = baseDepositFee + performanceOverageFee;
            calculatedNet = priceUSD - calculatedFee;
            overageAccumulator += overageDelta;

            if (order.status === "completed") {
              liquidAccumulator += calculatedNet;
            } else if (order.status === "pending" || order.status === "shipped" || order.status === "delivered") {
              // High ticket 10% token deposit is securely locked inside Vault escrow
              escrowAccumulator += (priceUSD * 0.10);
            }
          }

          if (order.status === "completed") {
            feesAccumulator += calculatedFee;
          }

          ledgerRows.push({
            id: docSnapshot.id,
            date: order.createdAt,
            gross: priceUSD,
            fee: calculatedFee,
            net: calculatedNet,
            status: order.status,
            type: isHighTicket ? "Escrow High-Ticket" : "Standard Retail"
          });
        });

        setMetrics({
          liquidBalanceUSD: liquidAccumulator,
          escrowHoldsUSD: escrowAccumulator,
          lifetimeVolumeUSD: grossAccumulator,
          platformFeesPaidUSD: feesAccumulator,
          overagePremiumsUSD: overageAccumulator
        });
        setHistoricalLedger(ledgerRows.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      } catch (err) {
        console.error("Critical failure computing financial metrics sheet:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      compileFinancialLedger();
    }
  }, [storeId, user]);

  // --- 4. EXPORT TO CSV DATA COMPILER ---
  const exportToCSV = () => {
    const headers = ["Order ID,Date,Type,Gross (USD),Fees Paid (USD),Net Earnings (USD),Status\n"];
    const rows = historicalLedger.map(r => 
      `${r.id},${new Date(r.date).toLocaleDateString()},${r.type},${r.gross},${r.fee},${r.net},${r.status}`
    ).join("\n");
    
    const blob = new Blob([...headers, rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Store_${storeId}_Vault_Report_2026.csv`);
    a.click();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm font-semibold tracking-wider text-teal-600 uppercase animate-pulse">
        Fetching Vault Ledger Balance Matrices...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* 📊 VAULT FINANCIAL CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 border-gray-100">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-teal-600" /> VAULT MANAGEMENT BALANCE SHEET
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Reconcile liquid balances, evaluate performance overage yields, and export clean bookkeeping logs.
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Account Ledger
        </button>
      </div>

      {/* 📈 MACRO REPORTING SUMMARY GRID CARD PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric Card 1: Distributable liquid assets */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Available Liquid Balance</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Coins className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">${metrics.liquidBalanceUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Fully cleared for payout</p>
        </div>

        {/* Metric Card 2: Escrow Hold Allocations */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">In-Flight Escrow Holds</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Wallet className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">${metrics.escrowHoldsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-0.5"><Clock className="w-3 h-3" /> Locked 10% high-ticket bounds</p>
        </div>

        {/* Metric Card 3: Performance Premium Delta */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Overage Auction Premiums</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">${metrics.overagePremiumsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> Volume cleared above reserves</p>
        </div>

        {/* Metric Card 4: Historical Gross Sales Volume */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Gross Lifetime Volume</span>
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Percent className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">${metrics.lifetimeVolumeUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Platform Treasury Split: ${metrics.platformFeesPaidUSD.toLocaleString("en-US")}</p>
        </div>

      </div>

      {/* 📜 HISTORICAL FISCAL BOOKKEEPING ENTRIES TABLE */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-900 tracking-tight text-base">TRANSACTION STREAM LOG</h3>
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">Fiscal Year 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-5">Transmission ID</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Compliance Track</th>
                <th className="py-3 px-5 text-right">Gross Amount</th>
                <th className="py-3 px-5 text-right">Platform Fee Deducted</th>
                <th className="py-3 px-5 text-right">Net Payout</th>
                <th className="py-3 px-5 text-center">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {historicalLedger.length > 0 ? (
                historicalLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs text-gray-900 font-bold">#{row.id.slice(0, 8)}</td>
                    <td className="py-3.5 px-5 text-gray-600">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        row.type.includes("Escrow") ? "bg-amber-50 text-amber-700" : "bg-teal-50 text-teal-700"
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-medium text-gray-900">${row.gross.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-5 text-right text-red-600 font-medium">-${row.fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-5 text-right text-emerald-600 font-bold">${row.net.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                        row.status === "completed" ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}>
                        {row.status === "completed" ? "Settled" : "In Escrow"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No financial data stream available for this storefront.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
