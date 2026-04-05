"use client";

import React, { useState, useEffect } from "react";
// Mock data for initial wireup - replace with Firestore query later
const mockPartnerData = {
  creditsEarned: 12,
  activeListings: 5,
  partnerTier: "Elite Partner (M5)",
  balances: {
    pending: "$263.00",
    paid: "$540.00",
    withdrawn: "$300.00",
    available: "$240.00"
  },
  merchants: [
    { name: "Emily's Crafts", owner: "Emily Peters" },
    { name: "Jumper's Outfits", owner: "Oscar Salgado" },
    { name: "Ultimate Pens", owner: "Sophia Chen" }
  ]
};

export default function RewardsDashboard() {
  const [data, setData] = useState(mockPartnerData);

  const copyToClipboard = (type: string) => {
    const link = `bazaria.world/join?type=${type}&ref=BO_SEPEHRI`;
    navigator.clipboard.writeText(link);
    alert(`${type === 'merchant' ? 'Merchant' : 'Partner'} Invite Link Copied!`);
  };

  // --- INDUSTRIAL STRENGTH LAYOUT (Fail-Safe against global conflicts) ---
  const s = {
    wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', color: '#1e293b', fontFamily: 'sans-serif' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' as const, gap: '20px' },
    refBox: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' },
    // BRIGHT WHITE CARDS with premium spacing and shadow
    card: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStat: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    storeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', marginTop: '24px' },
    badge: { padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, textTransform: 'uppercase' as const, letterSpacing: '1px' },
    btnText: { background: 'none', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, color: '#64748b', cursor: 'pointer' }
  };

  return (
    <div style={s.wrapper}>
      
      {/* 🚀 DUAL-ACTION INVITE HEADER: Separating Merchants from Partners */}
      <div style={s.headerRow}>
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', color: '#0f172a' }}>
            Partner <span style={{ color: '#94a3b8', fontWeight: '300' }}>Command</span>
          </h1>
          <p style={{ color: '#0d9488', fontSize: '12px', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Official Success Partner Console
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {/* 🏬 MERCHANT INVITE */}
          <div style={s.refBox}>
            <div>
              <p style={{ fontSize: '8px', fontWeight: '900', color: '#0d9488', textTransform: 'uppercase', marginBottom: '2px' }}>Onboard Merchant / Seller</p>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>bazaria.world/join?type=merchant&ref=BO</p>
            </div>
            <button 
              onClick={() => copyToClipboard('merchant')}
              style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '10px' }}
            >
              COPY
            </button>
          </div>

          {/* 🤝 PARTNER INVITE */}
          <div style={s.refBox}>
            <div>
              <p style={{ fontSize: '8px', fontWeight: '900', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '2px' }}>Invite Referral Partner</p>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>bazaria.world/join?type=partner&ref=BO</p>
            </div>
            <button 
              onClick={() => copyToClipboard('partner')}
              style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '10px' }}
            >
              COPY
            </button>
          </div>
        </div>
      </div>

      <div style={s.mainGrid}>
        
        {/* LEFT: PARTNER PROFILE & TRUST IDENTITY */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            
            {/* 📸 IDENTITY PROTOCOL: Picture Verification Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '24px', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                   {/* This would soon hold the uploaded picture */}
                </div>
                <button style={{ ...s.btnText, padding: '4px 10px', fontSize: '9px', textTransform: 'uppercase' }}>Add Photo</button>
            </div>

            <div>
              <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px' }}>Bo Sepehri</h3>
              <span style={{ color: '#0d9488', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>CERTIFIED SUCCESS PARTNER</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={s.miniStat}><small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase'}}>Credits</small><br/><b style={{fontSize: '22px'}}>{data.creditsEarned}</b></div>
            <div style={s.miniStat}><small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase'}}>Listings</small><br/><b style={{fontSize: '22px'}}>{data.activeListings}</b></div>
          </div>

          <div style={{marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
             <div style={{backgroundColor: '#f0fdf4', color: '#166534', ...s.badge, textAlign: 'center'}}>Success Network: Active</div>
             <div style={{backgroundColor: '#fffbeb', color: '#92400e', ...s.badge, textAlign: 'center', border: '1px solid #fef3c7'}}>Tier: {data.partnerTier}</div>
          </div>
        </div>

        {/* RIGHT: CAPITAL FLOW & FIAT INTEGRATION */}
        <div style={{ ...s.card, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '18px' }}>Capital Flow</h3>
             
             {/* 🏦 FIAT PROTOCOL: ACH/Bank Connection ONLY */}
             <div style={{ display: 'flex', gap: '10px' }}>
               <button style={s.btnText}>LINK BANK ACCOUNT (ACH)</button>
               {/* Note: Top Nav handles Connect Wallet */}
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>PENDING</p><b style={{color: '#f59e0b', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.pending}</b></div>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>PAID</p><b style={{color: '#10b981', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.paid}</b></div>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>WITHDRAWN</p><b style={{color: '#cbd5e1', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.withdrawn}</b></div>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>AVAILABLE</p><b style={{color: '#0f172a', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.available}</b></div>
          </div>
        </div>

        {/* BOTTOM: STOREFRONT NETWORK */}
        <div style={{ ...s.card, gridColumn: 'span 3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '18px' }}>Storefront Network</h3>
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '900', textTransform: 'uppercase' }}>Active Revenue Locks</span>
          </div>
          <div style={s.storeGrid}>
            {data.merchants.map(merchant => (
              <div key={merchant.name} style={{ padding: '32px 24px', border: '1px solid #f1f5f9', borderRadius: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏬</div>
                <b style={{ fontSize: '16px', color: '#1e293b', display: 'block' }}>{merchant.name}</b>
                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '1px' }}>{merchant.owner}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
