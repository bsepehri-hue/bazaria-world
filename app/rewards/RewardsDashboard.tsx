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
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '40px' 
  }}>
     <h3 style={{ 
       fontWeight: '900', 
       textTransform: 'uppercase', 
       letterSpacing: '1px', 
       fontSize: '18px', 
       color: '#1e293b',
       fontStyle: 'italic'
     }}>
       Capital Flow
     </h3>
     
     {/* 🏦 THE POWER GREEN ACTION */}
     <button 
       style={{ 
         backgroundColor: '#10b981', // THE POWER GREEN
         color: '#ffffff', 
         border: 'none', 
         padding: '14px 28px', 
         borderRadius: '16px', 
         fontSize: '11px', 
         fontWeight: '900', 
         cursor: 'pointer',
         textTransform: 'uppercase',
         letterSpacing: '1px',
         boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)', // The Green Glow
         transition: 'all 0.2s ease',
       }}
       onMouseEnter={(e) => {
         e.currentTarget.style.transform = 'translateY(-2px)';
         e.currentTarget.style.backgroundColor = '#059669'; // Darker green on hover
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.backgroundColor = '#10b981';
       }}
     >
       Link Bank Account (ACH)
     </button>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
    <div>
      <p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>PENDING</p>
      <b style={{color: '#f59e0b', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.pending}</b>
    </div>
    <div>
      <p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>PAID</p>
      <b style={{color: '#10b981', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.paid}</b>
    </div>
    <div>
      <p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>WITHDRAWN</p>
      <b style={{color: '#cbd5e1', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.withdrawn}</b>
    </div>
    <div>
      <p style={{fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px'}}>AVAILABLE</p>
      <b style={{color: '#0f172a', fontSize: '28px', letterSpacing: '-1px'}}>{data.balances.available}</b>
    </div>
  </div>
</div>

{/* 🎓 SUCCESS PARTNER ACADEMY: The Revenue Playbook */}
<div style={{ ...s.card, gridColumn: 'span 1' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
     <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '16px', color: '#1e293b' }}>
       Success Academy
     </h3>
     <span style={{ fontSize: '18px' }}>🎓</span>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {[
      { title: "Protocol Rules", desc: "Understanding the 5% Success Fee", icon: "📜" },
      { title: "Revenue Maxing", desc: "Strategies for Tier M5 Scaling", icon: "📈" },
      { title: "Onboarding Kit", desc: "Merchant pitch deck & scripts", icon: "💼" }
    ].map((item, i) => (
      <a 
        key={i} 
        href="#" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '12px', 
          borderRadius: '16px', 
          backgroundColor: '#f8fafc', 
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          border: '1px solid transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <span style={{ fontSize: '18px' }}>{item.icon}</span>
        <div>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#1e293b' }}>{item.title}</p>
          <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: '600' }}>{item.desc}</p>
        </div>
      </a>
    ))}
  </div>

  <button style={{ 
    marginTop: '20px', 
    width: '100%', 
    padding: '12px', 
    borderRadius: '14px', 
    border: '2px solid #f1f5f9', 
    backgroundColor: 'transparent', 
    fontSize: '10px', 
    fontWeight: '900', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    cursor: 'pointer' 
  }}>
    Full Training Portal →
  </button>
</div>
  <div style={{ ...s.card, gridColumn: 'span 1' }}>
  
  {/* 🏆 GLOBAL LEADERBOARD (FOMO) */}
  <div style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
       <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', color: '#1e293b' }}>
         Global Leaderboard 🏆
       </h3>
       <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '900' }}>TOP 1%</span>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { rank: 1, name: "Diego M.", amt: "$14,290", active: false },
        { rank: 2, name: "Bo Sepehri", amt: "$12,540", active: true },
        { rank: 3, name: "Elena R.", amt: "$11,100", active: false }
      ].map((user, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 16px', 
          backgroundColor: user.active ? '#f0fdf4' : '#f8fafc', 
          borderRadius: '14px',
          border: user.active ? '1px solid #10b981' : '1px solid transparent'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <b style={{ fontSize: '12px', color: '#94a3b8' }}>#{user.rank}</b>
            <span style={{ fontSize: '13px', fontWeight: '900' }}>{user.name}</span>
          </div>
          <b style={{ fontSize: '13px', color: user.active ? '#10b981' : '#1e293b' }}>{user.amt}</b>
        </div>
      ))}
    </div>
  </div>

  {/* 📄 TAX & COMPLIANCE (The 1099 Vault) */}
  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '30px' }}>
    <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', color: '#1e293b', marginBottom: '20px' }}>
      Compliance Vault 📄
    </h3>
    <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
        2025 Tax Year (1099-MISC)
      </p>
      <button style={{ 
        width: '100%', 
        backgroundColor: '#1e293b', 
        color: '#fff', 
        padding: '12px', 
        borderRadius: '12px', 
        fontSize: '10px', 
        fontWeight: '900', 
        border: 'none',
        cursor: 'pointer'
      }}>
        GENERATE TAX DOCS
      </button>
      <p style={{ margin: '12px 0 0 0', fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>
        Identity Verified • Form 1099 Ready
      </p>
    </div>
  </div>

</div>   

    {/* 📈 RIGHT SIDE: REVENUE PROJECTION & NETWORK YIELD */}
<div style={{ ...s.card, gridColumn: 'span 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
       <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', color: '#1e293b' }}>
         Yield Projector 📈
       </h3>
       <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '900' }}>ELITE M5 MODE</span>
    </div>

    {/* THE MATH BOX */}
    <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '24px', color: '#fff', marginBottom: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
      <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Annual Residual Potential</p>
      <h2 style={{ fontSize: '38px', fontWeight: '900', margin: '8px 0', letterSpacing: '-1.5px' }}>
        $180,000<span style={{ fontSize: '16px', color: '#10b981' }}>/yr</span>
      </h2>
      <div style={{ display: 'flex', gap: '15px', marginTop: '15px', borderTop: '1px solid #1e293b', paddingTop: '15px' }}>
        <div>
          <p style={{ margin: 0, fontSize: '8px', color: '#64748b', fontWeight: '800' }}>MERCHANTS</p>
          <b style={{ fontSize: '14px' }}>10</b>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '8px', color: '#64748b', fontWeight: '800' }}>AVG VOL</p>
          <b style={{ fontSize: '14px' }}>$50k</b>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '8px', color: '#64748b', fontWeight: '800' }}>MONTHLY</p>
          <b style={{ fontSize: '14px', color: '#10b981' }}>$15,000</b>
        </div>
      </div>
    </div>

    {/* 🤝 SETTLEMENT PARTNERS: The Legal Bridge */}
    <div style={{ marginTop: '30px' }}>
      <p style={{ fontSize: '10px', fontWeight: '900', color: '#1e293b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Verified Settlement Partners</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { name: "Soto & Associates", type: "Law Firm / Escrow", city: "Santo Domingo" },
          { name: "Elite Realty Group", type: "Licensed Brokerage", city: "Miami" }
        ].map((partner, i) => (
          <div key={i} style={{ padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '900' }}>{partner.name}</p>
              <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', fontWeight: '700' }}>{partner.type}</p>
            </div>
            <span style={{ fontSize: '12px' }}>🛡️</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  <button style={{ 
    marginTop: '30px', 
    width: '100%', 
    padding: '16px', 
    borderRadius: '16px', 
    backgroundColor: '#f8fafc', 
    border: '1px solid #e2e8f0', 
    fontSize: '11px', 
    fontWeight: '900', 
    color: '#1e293b', 
    textTransform: 'uppercase', 
    cursor: 'pointer' 
  }}>
    Model Your Global Network →
  </button>
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
