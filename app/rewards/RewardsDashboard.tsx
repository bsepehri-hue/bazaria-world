"use client";

import React from "react";

export default function RewardsDashboard() {
  // --- INLINE STYLES FOR GUARANTEED LAYOUT ---
  const s = {
    wrapper: { backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px', color: '#111827', fontFamily: 'sans-serif' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap' as const, gap: '20px' },
    refBox: { backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
    card: { backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' },
    miniStat: { padding: '15px', backgroundColor: '#f9fafb', borderRadius: '12px' },
    storeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' },
    badge: { padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold' as const, textTransform: 'uppercase' as const }
  };

  return (
    <div style={s.wrapper}>
      
      {/* 🚀 HEADER SECTION */}
      <div style={s.headerRow}>
        <div>
          <p style={{ color: '#0d9488', fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Steward Protocol Alpha</p>
          <h1 style={{ fontSize: '48px', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>Steward <span style={{ color: '#d1d5db', fontStyle: 'italic' }}>Command</span></h1>
        </div>

        <div style={s.refBox}>
          <div>
            <p style={{ fontSize: '9px', fontWeight: '900', color: '#b45309', textTransform: 'uppercase', marginBottom: '4px' }}>Lifetime Success Link</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>bazaria.world/join?ref=BO_SEPEHRI</p>
          </div>
          <button style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}>COPY</button>
        </div>
      </div>

      <div style={s.mainGrid}>
        
        {/* LEFT: PROFILE */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#f3f4f6', borderRadius: '15px' }}></div>
            <div>
              <h3 style={{ margin: 0, fontWeight: '900' }}>Bo Sepehri</h3>
              <span style={{ color: '#0d9488', fontSize: '10px', fontWeight: 'bold' }}>TRUSTED STEWARD</span>
            </div>
          </div>
          <div style={s.statsGrid}>
            <div style={s.miniStat}><small style={{color: '#9ca3af', fontWeight: 'bold', fontSize: '9px'}}>CREDITS</small><br/><b>12</b></div>
            <div style={s.miniStat}><small style={{color: '#9ca3af', fontWeight: 'bold', fontSize: '9px'}}>LISTINGS</small><br/><b>5</b></div>
          </div>
          <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
             <div style={{backgroundColor: '#ecfdf5', color: '#059669', ...s.badge, textAlign: 'center', padding: '10px'}}>Referral Constellation: Active</div>
             <div style={{backgroundColor: '#f59e0b', color: 'white', ...s.badge, textAlign: 'center', padding: '10px'}}>Unlocked: Orion (M5)</div>
          </div>
        </div>

        {/* MIDDLE: CAPITAL FLOW */}
        <div style={{ ...s.card, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
             <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' }}>Capital Flow</h3>
             <button style={{ background: 'none', border: '1px solid #e5e7eb', padding: '5px 15px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>CONNECT WALLET</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div><p style={{fontSize: '9px', fontWeight: 'bold', color: '#9ca3af'}}>PENDING</p><b style={{color: '#f59e0b', fontSize: '20px'}}>$263.00</b></div>
            <div><p style={{fontSize: '9px', fontWeight: 'bold', color: '#9ca3af'}}>PAID</p><b style={{color: '#0d9488', fontSize: '20px'}}>$540.00</b></div>
            <div><p style={{fontSize: '9px', fontWeight: 'bold', color: '#9ca3af'}}>WITHDRAWN</p><b style={{color: '#9ca3af', fontSize: '20px'}}>$300.00</b></div>
            <div><p style={{fontSize: '9px', fontWeight: 'bold', color: '#9ca3af'}}>AVAILABLE</p><b style={{color: '#111827', fontSize: '20px'}}>$240.00</b></div>
          </div>
        </div>

        {/* BOTTOM: STOREFRONT NETWORK */}
        <div style={{ ...s.card, gridColumn: 'span 3' }}>
          <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '20px' }}>Your Storefront Network</h3>
          <div style={s.storeGrid}>
            {["Emily's Crafts", "Jumper's Outfits", "Ultimate Pens"].map(name => (
              <div key={name} style={{ padding: '20px', border: '1px solid #f3f4f6', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🏬</div>
                <b style={{ fontSize: '14px' }}>{name}</b>
                <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold', marginTop: '5px' }}>ACTIVE PARTNER</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
