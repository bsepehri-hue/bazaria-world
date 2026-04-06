"use client";

import React, { useState, useEffect } from "react";
// 🚀 THIS IS THE KEY: We are pointing to your working Marketplace engine
// 🚀 This uses the "@" alias to find the root, then drills into /app/lib
// 🚀 1. Go UP to /app. 2. Go UP to root /bazaria-world. 3. Go DOWN into /lib.
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function RewardsDashboard() {
  const [partnerData, setPartnerData] = useState({
    paid: 540.00,
    available: 240.00,
    credits: 12,
    listings: 5,
    tier: "Elite Partner (M5)",
    name: "Bo Sepehri"
  });

 useEffect(() => {
    // 🔍 THIS WILL TELL US THE TRUTH
    console.log("🌐 CURRENT PROJECT ID:", db.app.options.projectId);
    console.log("📍 LOOKING FOR PATH: partners/BO_SEPEHRI");

    const docRef = doc(db, "partners", "BO_SEPEHRI");
    
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        console.log("✅ FOUND IT!", snap.data());
        setPartnerData(snap.data() as any);
      } else {
        // 🚨 IF YOU SEE THIS, COMPARE THE PROJECT ID BELOW TO YOUR FIREBASE URL
        console.error("❌ NOT FOUND IN PROJECT:", db.app.options.projectId);
      }
    }, (err) => console.error("❌ FIREBASE ERROR:", err.message));

    return () => unsub();
  }, []);

  const copyToClipboard = (type: string) => {
    const link = `bazaria.world/join?type=${type}&ref=BO_SEPEHRI`;
    navigator.clipboard.writeText(link);
    alert(`${type === 'merchant' ? 'Merchant' : 'Partner'} Invite Link Copied!`);
  };

  const s = {
    wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', color: '#1e293b', fontFamily: 'sans-serif' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' as const, gap: '20px' },
    refBox: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStat: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    badge: { padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, textTransform: 'uppercase' as const, letterSpacing: '1px', textAlign: 'center' as const },
    btnText: { background: 'none', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, color: '#64748b', cursor: 'pointer' }
  };

  return (
    <div style={s.wrapper}>
      
      {/* 🚀 HEADER & INVITES */}
      <div style={s.headerRow}>
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', color: '#0f172a' }}>
            Partner <span style={{ color: '#94a3b8', fontWeight: '300' }}>Command</span>
          </h1>
          <p style={{ color: '#0d9488', fontSize: '12px', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Official Success Partner Console
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={s.refBox}>
            <div>
              <p style={{ fontSize: '8px', fontWeight: '900', color: '#0d9488', textTransform: 'uppercase', marginBottom: '2px' }}>Onboard Merchant</p>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>bazaria.world/join?type=merchant&ref=BO</p>
            </div>
            <button onClick={() => copyToClipboard('merchant')} style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '10px' }}>COPY</button>
          </div>
          <div style={s.refBox}>
            <div>
              <p style={{ fontSize: '8px', fontWeight: '900', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '2px' }}>Invite Referral Partner</p>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>bazaria.world/join?type=partner&ref=BO</p>
            </div>
            <button onClick={() => copyToClipboard('partner')} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '10px' }}>COPY</button>
          </div>
        </div>
      </div>

      <div style={s.mainGrid}>
        
        {/* LEFT COLUMN: IDENTITY & ACADEMY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '24px', border: '3px solid #fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <div>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px' }}>{partnerData.name}</h3>
                <span style={{ color: '#0d9488', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Certified Success Partner</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={s.miniStat}><small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px'}}>CREDITS</small><br/><b style={{fontSize: '22px'}}>{partnerData.credits}</b></div>
              <div style={s.miniStat}><small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px'}}>LISTINGS</small><br/><b style={{fontSize: '22px'}}>{partnerData.listings}</b></div>
            </div>
            <div style={{backgroundColor: '#f0fdf4', color: '#166534', ...s.badge, marginBottom: '12px'}}>Success Network: Active</div>
            <div style={{backgroundColor: '#fffbeb', color: '#92400e', ...s.badge, border: '1px solid #fef3c7'}}>Tier: {partnerData.tier}</div>
          </div>

          <div style={s.card}>
            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', marginBottom: '24px' }}>Success Academy 🎓</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { t: "Protocol Rules", d: "The 6% Fee & 3% Split", i: "📜" },
                { t: "Revenue Maxing", d: "Scaling to M5 Residuals", i: "📈" },
                { t: "Onboarding Kit", d: "Pitch Deck & Scripts", i: "💼" }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                  <span>{item.i}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '900' }}>{item.t}</p>
                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b' }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: CAPITAL FLOW & LEADERBOARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}>Capital Flow</h3>
              <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' }}>LINK BANK (ACH)</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{fontSize: '9px', color: '#94a3b8', fontWeight: '800'}}>PAID</p>
                <b style={{fontSize: '24px', color: '#10b981'}}>${partnerData.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</b>
              </div>
              <div>
                <p style={{fontSize: '9px', color: '#94a3b8', fontWeight: '800'}}>AVAILABLE</p>
                <b style={{fontSize: '24px'}}>${partnerData.available.toLocaleString(undefined, {minimumFractionDigits: 2})}</b>
              </div>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}>Global Leaderboard 🏆</h3>
              <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '800' }}>ALL-TIME</span>
            </div>
            {[{ r: 1, n: "Diego M.", a: "$142k" }, { r: 2, n: "Bo Sepehri", a: "$125k" }].map((u, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: u.n.includes("Bo") ? '#f0fdf4' : '#f8fafc', borderRadius: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800' }}>#{u.r} {u.n}</span>
                <b style={{ fontSize: '12px' }}>{u.a}</b>
              </div>
            ))}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '16px', textAlign: 'center' }}>
               <p style={{ margin: 0, fontSize: '10px', fontWeight: '700' }}>2025 Tax Year (1099-MISC)</p>
               <button style={{ width: '100%', marginTop: '10px', backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '9px', fontWeight: '900' }}>GENERATE TAX DOCS</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROJECTION & LOCAL SETTLEMENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ ...s.card, backgroundColor: '#0f172a', color: '#fff' }}>
            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Yield Projector 📈</h3>
            <h2 style={{ fontSize: '36px', fontWeight: '900', margin: '0' }}>$180,000<span style={{ fontSize: '14px', color: '#10b981' }}>/yr</span></h2>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', marginTop: '10px' }}>10 STORES @ $50K VOL</p>
            <div style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>$15,000 / MO</span>
               <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748b' }}>ELITE M5</span>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '12px' }}>Settlement Partners</h3>
              <span style={{ fontSize: '9px', fontWeight: '900', color: '#64748b' }}>📍 DR / CARIBBEAN</span>
            </div>
            {["Soto & Associates", "Caribe Escrow"].map((p, i) => (
              <div key={i} style={{ padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '900' }}>{p}</span>
                <span style={{ fontSize: '12px' }}>🛡️</span>
              </div>
            ))}
            <button style={{ ...s.btnText, width: '100%', marginTop: '10px' }}>MODEL GLOBAL NETWORK →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
