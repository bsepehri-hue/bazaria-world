"use client";

import React, { useState, useEffect, use } from "react";
import { db, auth } from "@/lib/firebase/client";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { 
  Search, 
  Package, 
  ShieldAlert, 
  ArrowRight, 
  Filter, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function StorefrontOrdersDashboard({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = use(params);

  // --- 1. STATE MANAGEMENT ---
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // Options: all, standard, high-ticket, pending-logistics

  // --- 2. AUTHENTICATION PROTECTION WATCHER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- 3. FIRESTORE ENGINE TRANSACTION RETRIEVAL ---
  useEffect(() => {
    async function fetchStoreOrders() {
      if (!storeId) return;
      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        
        // Target transactional manifests matched to this specific storefront endpoint
        const qOrders = query(
          ordersRef,
          where("storeId", "==", storeId),
          orderBy("createdAt", "desc")
        );
        
        const snap = await getDocs(qOrders);
        const fetchedOrders = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Critical failure during storefront orders compilation:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchStoreOrders();
    }
  }, [storeId, user]);

  // --- 4. DYNAMIC ADVANCED FILTER MATRIX ---
  const filteredOrders = orders.filter((order) => {
    // A. Match typed text string against order reference tokens or buyer records
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch = s === "" || 
      order.id.toLowerCase().includes(s) || 
      (order.shippingAddress?.name || "").toLowerCase().includes(s) ||
      (order.shippingTrackingNumber || "").toLowerCase().includes(s);

    if (!matchesSearch) return false;

    // B. Evaluate asset valuation threshold brackets ($5,000 hybrid cutoff tier)
    const priceUSD = order.totalPriceUSD || 0;
    if (activeTab === "standard") return priceUSD < 5000;
    if (activeTab === "high-ticket") return priceUSD >= 5000;
    if (activeTab === "pending-logistics") return order.status === "pending" || order.status === "awaiting-payment";

    return true;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-sm font-semibold tracking-wide uppercase text-teal-600 animate-pulse">
        Compiling Store Transaction Ledgers...
      </div>
    );
  }

  // Enforce access control barriers if unauthorized workspace entry is flagged
  if (!user) {
    return (
      <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 m-6 flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5" /> Please sign in to authenticate administration dashboards.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* 🏛️ HEADER CONTROLS */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          STOREFRONT REVENUE MANIFEST
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track fulfillment sequences, inspect escrow deposit blocks, and monitor your multi-channel take-rate compliance parameters.
        </p>
      </div>

      {/* 🛠️ FILTER BAR HUD */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Instant lookup filter */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order Number, Buyer Name, Tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full rounded-lg border-gray-200 text-sm focus:border-teal-500 focus:ring-teal-500 outline-none h-9 border"
          />
        </div>

        {/* Tab Selection Switches */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto text-xs font-bold uppercase">
          {[
            { id: "all", label: "All Traces" },
            { id: "standard", label: "Standard (<$5k)" },
            { id: "high-ticket", label: "Escrow Locked (≥$5k)" },
            { id: "pending-logistics", label: "Awaiting Action" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
                activeTab === tab.id 
                  ? "bg-white text-teal-700 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 ORDER LEDGER DATA MATRIX */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Order Identity</th>
                  <th className="py-3 px-4">Initialization Date</th>
                  <th className="py-3 px-4">Acquisition Class</th>
                  <th className="py-3 px-4">Buyer Entity</th>
                  <th className="py-3 px-4 text-right">Gross Value</th>
                  <th className="py-3 px-4 text-center">Lifecycle Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.map((order) => {
                  const priceUSD = order.totalPriceUSD || 0;
                  const isEscrowTrack = priceUSD >= 5000;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Identity code token */}
                      <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                        #{order.id.slice(0, 8)}...
                      </td>
                      
                      {/* Timestamp configuration */}
                      <td className="py-4 px-4 text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }) : "N/A"}
                      </td>

                      {/* Hybrid valuation indicator tags */}
                      <td className="py-4 px-4">
                        {isEscrowTrack ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <ShieldAlert className="w-3 h-3 mr-1 flex-shrink-0" /> High Escrow Hold
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                            <Package className="w-3 h-3 mr-1 flex-shrink-0" /> Standard Retail
                          </span>
                        )}
                      </td>

                      {/* Buyer Identity Profile */}
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {order.shippingAddress?.name || "Verified Customer"}
                      </td>

                      {/* Financial Value Parameter columns */}
                      <td className="py-4 px-4 text-right font-black text-gray-900">
                        ${priceUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status state mapping grids */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border ${
                          order.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                          order.status === "shipped" || order.status === "delivered" ? "bg-blue-50 text-blue-700 border-blue-300" :
                          "bg-yellow-50 text-yellow-700 border-yellow-300"
                        }`}>
                          {order.status || "Pending"}
                        </span>
                      </td>

                      {/* Direct Ledger Connection Redirects */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-800 transition group"
                        >
                          Open Ledger 
                          <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Package className="w-8 h-8 mx-auto opacity-40 text-gray-400" />
            <p>No transactions registered under these filter bounds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
