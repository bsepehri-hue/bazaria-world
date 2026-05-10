"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/client"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import TopNav from "@/app/components/ui/TopNav";
import { 
  ShieldCheck, TrendingUp, Gem, Download, ArrowUpRight, AlertCircle 
} from "lucide-react";

export default function AccountVault() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'inventory'>('financials');

  const transactions = [
    { id: 'BAZ-TX-9901', desc: 'Studio 64 Settlement', gross: 1100000, fee: 22000, net: 1078000, date: 'APR 22', status: 'Settled' },
    { id: 'BAZ-TX-9905', desc: 'Sovereign Mobility #04', gross: 120000, fee: 2400, net: 117600, date: 'APR 24', status: 'Urgent' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUserData(docSnap.data());
        } catch (err) { console.error("Vault Access Error:", err); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf', fontWeight: '900' }}>
      DECRYPTING...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfcfc', color: '#0f172a', fontFamily: 'sans-serif' }}>
      
      {/* 🏛️ GLOBAL TOPNAV */}
      <TopNav />

      {/* 💳 SUB-NAV FOR VAULT TABS */}
      <div style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #eee', 
        padding: '12px 40px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px',
        position: 'sticky',
        top: '64px', // Assuming TopNav is roughly 64px high
        zIndex: 90 
      }}>
        {['overview', 'inventory', 'financials'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', 
              color: activeTab === tab ? '#0f172a' : '#ccc',
              borderBottom: activeTab === tab ? '2px solid #2dd4bf' : 'none',
              paddingBottom: '4px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' }}>
        
        {activeTab === 'financials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* 📈 PERFORMANCE GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div style={metricCard}>
                <span style={labelStyle}>Total Revenue</span>
                <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a', margin: '10px 0', fontStyle: 'italic' }}>$1,134,350</h3>
                <div style={{ color: '#2dd4bf', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TrendingUp size={14} /> +12.4% Performance
                </div>
              </div>

              <div style={metricCard}>
                <span style={labelStyle}>Active Bidding</span>
                <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a', margin: '10px 0', fontStyle: 'italic' }}>$420,000</h3>
                <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Current Silent Events</div>
              </div>

              <div style={{ ...metricCard, border: '1px solid #80002033', backgroundColor: '#fff5f5' }}>
                <span style={{ ...labelStyle, color: '#800020' }}>Action Required</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                  <AlertCircle color="#800020" size={24} />
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#800020' }}>1 Failed Settlement</span>
                </div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#800020', marginTop: '10px', textTransform: 'uppercase' }}>Resolve Identity Mismatch</div>
              </div>
            </div>

            {/* 🧾 LEDGER */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '40px', overflow: 'hidden' }}>
              <div style={{ padding: '40px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>Financial Ledger</h4>
                <button style={{ backgroundColor: '#0f172a', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Download size={14} /> Export QuickBooks
                </button>
              </div>

              {transactions.map((tx, i) => (
                <div key={i} style={{ padding: '24px 40px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: tx.status === 'Urgent' ? '#fff5f5' : '#f0fdfa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowUpRight size={18} color={tx.status === 'Urgent' ? '#800020' : '#2dd4bf'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 900 }}>{tx.desc}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>{tx.date} • {tx.id}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: tx.status === 'Urgent' ? '#800020' : '#0f172a' }}>
                       {tx.status === 'Urgent' ? 'RETRY' : `+$${tx.net.toLocaleString()}`}
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 900, color: tx.status === 'Urgent' ? '#800020' : '#2dd4bf', textTransform: 'uppercase' }}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

const metricCard = { backgroundColor: '#fff', border: '1px solid #eee', padding: '40px', borderRadius: '40px' };
const labelStyle = { fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '3px' };
