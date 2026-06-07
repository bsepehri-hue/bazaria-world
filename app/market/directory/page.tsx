"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import { FaStore, FaCheckCircle, FaSpinner, FaSearch, FaTimesCircle } from "react-icons/fa";

interface MerchantNode {
  id: string;
  storeName?: string;
  handle?: string;
  categoryFocus?: string;
  kioskDescription?: string;
  isVerifiedDirectoryNode?: boolean;
}

export default function DirectoryKioskPage() {
  const [merchants, setMerchants] = useState<MerchantNode[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Tracks user input
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storefrontsRef = collection(db, "storefronts");
    
    const unsubscribe = onSnapshot(storefrontsRef, (snapshot) => {
      const activeNodes: MerchantNode[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.storeName) {
          activeNodes.push({
            id: doc.id,
            storeName: data.storeName,
            handle: data.handle || doc.id,
            categoryFocus: data.categoryFocus || "General Marketplace",
            kioskDescription: data.kioskDescription || "Welcome to our boutique node. Explore our catalog of premier ledger assets.",
            isVerifiedDirectoryNode: data.isVerifiedDirectoryNode ?? true,
          });
        }
      });
      
      setMerchants(activeNodes);
      Loading(false);
    }, (error) => {
      Console.error("Directory Kiosk failed to stream merchant nodes:", error);
      Loading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⚡ REAL-TIME CLIENT FILTERING MATRIX
  const filteredMerchants = merchants.filter((node) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Show all if search is empty

    return (
      (node.storeName || "").toLowerCase().includes(query) ||
      (node.categoryFocus || "").toLowerCase().includes(query) ||
      (node.kioskDescription || "").toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', fontFamily: 'monospace' }}>
          <FaSpinner style={{ width: '32px', height: '32px', color: '#059669', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Syncing Kiosk Ledger...</p>
        </div>
      </div>
    );
  }

 return (
    /* 📱 CRASH-PROOF LOCKED VIEWPORT CONTAINER */
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden', 
      backgroundColor: '#fafafa', 
      padding: '32px 16px',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      touchAction: 'pan-y'
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb & Header */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '24px' }}>
          <Link 
            href="/market" 
            style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', textDecoration: 'none' }}
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

        {/* 🔍 THE SEARCH HUB BAR CONTAINER */}
        <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '500px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
            <FaSearch style={{ width: '16px', height: '16px' }} />
          </div>
          
          <input
            type="text"
            placeholder="Search stores, categories, or keywords (e.g., Jewelry, Pearl)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease'
            }}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
            >
              <FaTimesCircle style={{ width: '16px', height: '16px' }} />
            </button>
          )}
        </div>

        {/* Directory Card Grid */}
        {filteredMerchants.length === 0 ? (
          <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '48px', textAlign: 'center', maxWidth: '448px', margin: '48px auto 0 auto', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
            <FaStore style={{ width: '48px', height: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>No Matches Found</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>No boutique nodes match your current keyword parameter. Try searching another industry branch.</p>
          </div>
        ) : (
          /* Responsive Layout Matrix with Fixed Sizing Computations */
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', // Ensures column frames downscale fluidly on narrow screens without overflowing boundaries
            gap: '24px',
            width: '100%'
          }}>
            {filteredMerchants.map((node) => (
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
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ flex: 1 }}>
                  {/* Header: Title and Trust Shield Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
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
                      textDecoration: 'none'
                    }}
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
