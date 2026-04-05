"use client";

import React from "react";

export default function RewardsDashboard() {
  const copyToClipboard = () => {
    const link = "bazaria.world/join?ref=BO_SEPEHRI";
    navigator.clipboard.writeText(link);
    alert("Success Link Copied!");
  };

  const s = {
    wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', color: '#1e293b', fontFamily: 'sans-serif' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' as const, gap: '20px' },
    refBox: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px 30px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStat: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    storeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', marginTop: '24px' },
    badge: { padding: '10px', borderRadius: '14px', fontSize: '10px', fontWeight: '900' as const, textTransform: 'uppercase' as const, letterSpacing: '1px', textAlign: 'center' as const }
  };

  return (
    <div style={s.wrapper}>
      
      {/* 🚀 CLEAN HEADER - NO EXTRA TEXT */}
      <div style={s.headerRow}>
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', color: '#0f172a' }}>
            Partner <span style={{ color: '#94a3b8', fontWeight: '300' }}>Command</span>
          </h1>
          <p style={{ color: '#0d9488', fontSize: '11px', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Official Success Partner Console
          </p>
        </div>

        <div style={s.refBox}>
          <div>
            <p style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Invite New Partners</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>bazaria.world/join?ref=BO_SEPEHRI</p>
          </div>
          <button 
            onClick={copyToClipboard}
            style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' }}
          >
            COPY LINK
          </button>
        </div>
      </div>

      <div style={s.mainGrid}>
        
        {/* LEFT: PARTNER PROFILE */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '70px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '24px', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
               <img src="/profile-placeholder.png" alt="Bo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px' }}>Bo Sepehri</h3>
              <span style={{ color: '#0d9488', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Certified Success Partner</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={s.miniStat}><small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase'}}>Credits</small><br/><b style={{fontSize: '22px'}}>12</b></div>
            <div style={s.miniStat}><small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase'}}>Listings</small><br/><b style={{fontSize: '22px'}}>5</b></div>
          </div>

          <div style={{marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
             <div style={{backgroundColor: '#f0fdf4', color: '#166534', ...s.badge}}>Network Status: Active</div>
             <div style={{backgroundColor: '#fffbeb', color: '#92400e', ...s.badge, border: '1px solid #fef3c7'}}>Tier: Elite Partner (M5)</div>
          </div>
        </div>

        {/* RIGHT: CAPITAL FLOW */}
        <div style={{ ...s.card, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '18px', fontStyle: 'italic' }}>Capital Flow</h3>
             <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900', color: '#64748b', cursor: 'pointer' }}>CONNECT WALLET</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>PENDING</p><b style={{color: '#f59e0b', fontSize: '28px', letterSpacing: '-1px'}}>$263.00</b></div>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>PAID</p><b style={{color: '#10b981', fontSize: '28px', letterSpacing: '-1px'}}>$540.00</b></div>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>WITHDRAWN</p><b style={{color: '#cbd5e1', fontSize: '28px', letterSpacing: '-1px'}}>$300.00</b></div>
            <div><p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>AVAILABLE</p><b style={{color: '#0f172a', fontSize: '28px', letterSpacing: '-1px'}}>$240.00</b></div>
          </div>
        </div>

        {/* BOTTOM: STOREFRONT NETWORK */}
        <div style={{ ...s.card, gridColumn: 'span 3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '18px', fontStyle: 'italic' }}>Storefront Network</h3>
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '900', textTransform: 'uppercase' }}>Active Revenue Locks</span>
          </div>
          <div style={s.storeGrid}>
            {["Emily's Crafts", "Jumper's Outfits", "Ultimate Pens"].map(name => (
              <div key={name} style={{ padding: '32px 24px', border: '1px solid #f1f5f9', borderRadius: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏬</div>
                <b style={{ fontSize: '16px', color: '#1e293b', display: 'block' }}>{name}</b>
                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginTop: '8px' }}>Verified Partner</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
