// app/market/directory/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import { FaStore, FaCheckCircle, FaSpinner } from "react-icons/fa";

interface MerchantNode {
  id: string; // The merchant's UID or Document ID
  storeName?: string;
  handle?: string;
  categoryFocus?: string;
  kioskDescription?: string;
  isVerifiedDirectoryNode?: boolean;
}

export default function DirectoryKioskPage() {
  const [merchants, setMerchants] = useState<MerchantNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛰️ Real-time stream from your existing storefronts collection
    const storefrontsRef = collection(db, "storefronts");
    
    const unsubscribe = onSnapshot(storefrontsRef, (snapshot) => {
      const activeNodes: MerchantNode[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only index merchants who have taken the time to name their store
        if (data.storeName) {
          activeNodes.push({
            id: doc.id,
            storeName: data.storeName,
            handle: data.handle || doc.id,
            categoryFocus: data.categoryFocus || "General Marketplace",
            kioskDescription: data.kioskDescription || "Welcome to our boutique node. Explore our catalog of premier ledger assets.",
            isVerifiedDirectoryNode: data.isVerifiedDirectoryNode ?? true, // Defaults to true to grant that trust badge!
          });
        }
      });
      
      setMerchants(activeNodes);
      setLoading(false);
    }, (error) => {
      console.error("Directory Kiosk failed to stream merchant nodes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 font-mono">
          <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-black uppercase text-slate-500 tracking-wider">Syncing Kiosk Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <Link 
            href="/market" 
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors mb-3 font-mono"
          >
            &larr; Back to Marketplace
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-mono">
            Platform Business Directory
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Explore verified sovereign nodes, boutique catalogs, and professional merchant summaries.
          </p>
        </div>

        {/* Directory Card Grid */}
        {merchants.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-12 text-center max-w-md mx-auto mt-12 bg-white shadow-sm">
            <FaStore className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold font-mono text-slate-900 uppercase">No Storefronts Listed</h3>
            <p className="text-xs text-slate-500 mt-1">Configure your directory kiosk profile parameters in the merchant dashboard to appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {merchants.map((node) => (
              <div 
                key={node.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header: Title and Trust Shield Badge */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {node.storeName}
                      </h2>
                      
                      {/* 🛡️ TRUSTWORTHINESS SHIELD BADGE */}
                      {node.isVerifiedDirectoryNode && (
                        <FaCheckCircle 
                          className="text-emerald-600 w-4 h-4 flex-shrink-0" 
                          title="Verified Directory Node" 
                        />
                      )}
                    </div>
                  </div>

                  {/* Core Niche/Category Focus Tags */}
                  <p className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-4">
                    {node.categoryFocus}
                  </p>

                  {/* Old-School Presentation Paragraph */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg mb-4">
                    <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                      "{node.kioskDescription}"
                    </p>
                  </div>
                </div>

                {/* Direct Action Link to the Merchant Storefront Route */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Link 
                    href={`/storefront/${node.handle}`}
                    className="w-full text-center inline-flex justify-center items-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase font-mono tracking-wider rounded-lg transition-colors"
                  >
                    Walk Up to Counter &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
