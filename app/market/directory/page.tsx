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
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', padding: '32px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb & Header */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '32px' }}>
          <Link 
            href="/market" 
            style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em', color: '#64748b', textDecoration: 'none' }}
          >
            &larr; Back to Marketplace
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.5px', marginTop: '12px', marginBottom: '4px' }}>
            Platform Business Directory
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, fontWeight: '500' }}>
            Explore verified sovereign nodes, boutique catalogs, and professional merchant summaries.
          </p>
        </div>

        {/* Directory Card Grid */}
        {merchants.length === 0 ? (
          <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '48px', textAlign: 'center', maxWidth: '448px', margin: '48px auto 0 auto', backgroundColor: '#ffffff' }}>
            <FaStore style={{ width: '48px', height: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>No Storefronts Listed</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Configure your directory kiosk profile parameters in the merchant dashboard to appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '24px' }}>
            {merchants.map((node) => (
              <div 
                key={node.id}
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'between'
                }}
              >
                <div style={{ flex: 1 }}>
                  {/* Header: Title and Trust Shield Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, tracking: '-0.3px' }}>
                        {node.storeName}
                      </h2>
                      {node.isVerifiedDirectoryNode && (
                        <FaCheckCircle style={{ color: '#059669', width: '16px', height: '16px', flexShrink: 0 }} />
                      )}
                    </div>
                  </div>

                  {/* Core Niche/Category Focus Tags */}
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>
                    {node.categoryFocus}
                  </p>

                  {/* Presentation Paragraph Layout Block */}
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: '1.6', fontWeight: '500' }}>
                      "{node.kioskDescription}"
                    </p>
                  </div>
                </div>

                {/* Direct Action Button Link */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <Link 
                    href={`/storefront/${node.handle}`}
                    style={{ 
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px 16px', 
                      backgroundColor: '#0f172a', 
                      color: '#ffffff', 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      borderRadius: '10px', 
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0f172a'; }}
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
