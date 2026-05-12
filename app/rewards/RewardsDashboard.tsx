"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/client"; 
import { useAuth } from "@/app/providers/AuthProvider"; 
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getProductCode } from "@/lib/utils"; // 🧬 Import our centralized product code utility!
import MilestoneTracker from '@/components/MilestoneTracker';

interface Inquiry {
  id: string;
  customer_id: string;
  subject: string;
  message: string;
  created_at: string;
  product_code?: string; // Optional field if written directly to Firestore
  xid_chain?: {
    self: string;
    parent: string | null;
    siblings: string[];
    cross_links: string[];
  };
}

export default function RewardsDashboard() {
  // 🔽 MAKE SURE THIS LINE IS RIGHT HERE!
  const [isVolumeMenuOpen, setIsVolumeMenuOpen] = React.useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [partnerData, setPartnerData] = useState({
    paid: 15000.00,
    available: 540.00,
    credits: 12,
    listings: 5,
    tier: "Elite Partner (M5)",
    name: "Bo Sepehri",
    academyLevel: 3,
    volumeCapacity: 5000000
  });

  const [loadingData, setLoadingData] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?callback=/rewards");
      return;
    }

    const unsub = onSnapshot(doc(db, "partners", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setPartnerData(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoadingData(false);
    });

    return () => unsub();
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch("/api/inquiries");
        const result = await response.json();
        if (result.success) {
          setInquiries(result.data);
        }
      } catch (err) {
        console.error("Failed to load inquiries", err);
      } finally {
        setLoadingInquiries(false);
      }
    };
    
    fetchInquiries();
  }, []);

  const handleClaim = async (inquiryId: string) => {
    if (!user) return;
    setClaimingId(inquiryId);
    try {
      // 📡 Dispatches the target payload straight to our secure X-ID claim transaction endpoint!
      const response = await fetch("/api/inquiries/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          agentId: user.uid,
          setupCode: `BAZ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }),
      });

      const result = await response.json();
      if (result.success) {
        setInquiries(inquiries.filter((item) => item.id !== inquiryId));
        alert("Inquiry claimed successfully. Assigned as representative!");
      } else {
        alert("Claim failed: Lead was already claimed by another agent.");
      }
    } catch (err) {
      console.error("Error claiming lead:", err);
    } finally {
      setClaimingId(null);
    }
  };

  const copyToClipboard = (type: string) => {
    const refId = user?.uid?.substring(0, 5).toUpperCase() || "BO";
    const link = `bazaria.world/join?type=${type}&ref=${refId}`;
    navigator.clipboard.writeText(link);
    alert(`${type === 'merchant' ? 'Merchant' : 'Partner'} Invite Link Copied!`);
  };

  const s = {
    wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', fontFamily: 'sans-serif' },
    container: { padding: '40px', maxWidth: '1400px', margin: '0 auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' as const, gap: '20px' },
    refBox: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStatCardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '32px' },
    miniStatCard: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStatCardTitle: { fontWeight: '900', textTransform: 'uppercase' as const, fontSize: '14px', marginBottom: '32px' },
    miniStat: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    badge: { padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, textTransform: 'uppercase' as const, letterSpacing: '1px', textAlign: 'center' as const },
    btnText: { background: 'none', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, color: '#64748b', cursor: 'pointer' },
    urgentMini: { backgroundColor: '#05292e', borderLeft: '4px solid #0d9488', borderRadius: '20px', padding: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
  };

  if (authLoading) return <div className="p-20 text-center font-black text-teal-600">PROTOCOL SYNCING...</div>;

  return (
    <div style={s.wrapper}>
      <div style={s.container}>
        
        {/* ⚡ URGENT MINI - WORKBENCH */}
        <div style={s.urgentMini}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ fontSize: '24px' }}>⚡</div>
            <div>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Unassigned Pool Inquiries</p>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#fff' }}>LIVE LISTING AGENT WORKBENCH</h3>
            </div>
          </div>
        </div>

        {/* 🚀 HEADER */}
        <div style={s.headerRow}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', color: '#0f172a' }}>
              Partner <span style={{ color: '#94a3b8', fontWeight: '300' }}>Command</span>
            </h1>
            <p style={{ color: '#0d9488', fontSize: '12px', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase' }}>
              Official Success Partner Console
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={s.refBox}>
              <button onClick={() => copyToClipboard('merchant')} style={s.btnText}>COPY MERCHANT LINK</button>
            </div>
            <div style={s.refBox}>
              <button onClick={() => copyToClipboard('partner')} style={s.btnText}>COPY PARTNER LINK</button>
            </div>
          </div>
        </div>

   
        
        {/* 🏆 AGENT MILESTONE AUTOMATION LEDGER */}
        <div style={{ width: '100%', marginTop: '24px', marginBottom: '24px' }}>
          <MilestoneTracker 
  currentLtb={340} 
  targetLtb={500} 
  onInjectClick={() => setIsVolumeMenuOpen(true)} 
/>
        </div>

        {/* Next down in your file will be your product/badge line container: */}
        {/* <div className="flex items-center justify-between"> ... */}

        {/* Dynamic Display of Inquiries from the Pool */}
        <div style={{ marginBottom: '40px' }}>
          {loadingInquiries ? (
            <p style={{ color: '#0d9488', fontWeight: '600' }}>Checking for available pool inquiries...</p>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ color: '#64748b', margin: 0, fontWeight: '600' }}>No new inquiries in the pool right now. Check back shortly!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {inquiries.map((inq) => {
                // 🧬 Resolve the 5-digit Product Reference Code securely
                const displayCode = inq.product_code || 
                                    (inq.xid_chain?.parent ? getProductCode(inq.xid_chain.parent) : "GENERAL");

                // Clean header: Strip bracketed metadata like [PROD-xxxxx] or [Ref: #xxxxx] if present
                const cleanSubject = inq.subject.replace(/\s*\[Ref:\s*#[A-Z0-9]{5}\]/gi, "").replace(/\s*\[PROD-[A-Z0-9]{5}\]/gi, "");

                return (
                  <div key={inq.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px' }}>
                    <div>
                      {/* Badge Header Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontWeight: 900 }}>
                          UNASSIGNED LEAD
                        </span>
                        
                        {/* ⚡ Structural Product Reference Badge */}
                        <span style={{ 
                          fontSize: '10px', 
                          backgroundColor: '#05292e', 
                          color: '#FFBF00', 
                          border: '1px solid #FFBF00', 
                          padding: '4px 8px', 
                          borderRadius: '6px', 
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          letterSpacing: '0.5px'
                        }}>
                          #{displayCode}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '900', color: '#0f172a' }}>
                        {cleanSubject}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', marginBottom: '20px' }}>
                        {inq.message}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleClaim(inq.id)}
                      disabled={claimingId === inq.id}
                      style={{ 
                        width: '100%', 
                        backgroundColor: '#0d9488', 
                        border: 'none', 
                        color: '#fff', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        fontWeight: '900', 
                        fontSize: '11px', 
                        cursor: claimingId === inq.id ? 'not-allowed' : 'pointer', 
                        opacity: claimingId === inq.id ? 0.6 : 1 
                      }}
                    >
                      {claimingId === inq.id ? 'CLAIMING...' : 'ACCEPT DEAL & ASSIGN'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={s.mainGrid}>
          {/* IDENTITY CARD */}
          <div style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '24px' }} />
              <div>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px' }}>{partnerData.name}</h3>
                <span style={{ color: '#0d9488', fontSize: '10px', fontWeight: '900' }}>Certified Success Partner</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={s.miniStat}>
                <small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px'}}>ACADEMY</small><br/>
                <b style={{fontSize: '20px', color: '#f59e0b'}}>LVL {partnerData.academyLevel}</b>
              </div>
              <div style={s.miniStat}>
                <small style={{color: '#94a3b8', fontWeight: '800', fontSize: '9px'}}>VOL CAP</small><br/>
                <b style={{fontSize: '18px'}}>${(partnerData.volumeCapacity / 1000000).toFixed(1)}M</b>
              </div>
            </div>
            <div style={{backgroundColor: '#f0fdf4', color: '#166534', ...s.badge, marginBottom: '12px'}}>Success Network: Active</div>
            <div style={{backgroundColor: '#fffbeb', color: '#92400e', ...s.badge, border: '1px solid #fef3c7'}}>Tier: {partnerData.tier}</div>
          </div>

          {/* CAPITAL FLOW */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={s.card}>
              <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', marginBottom: '32px' }}>Capital Flow</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{fontSize: '9px', color: '#94a3b8', fontWeight: '800'}}>PAID</p>
                  <b style={{fontSize: '24px', color: '#10b981'}}>${partnerData.paid.toLocaleString()}</b>
                </div>
                <div>
                  <p style={{fontSize: '9px', color: '#94a3b8', fontWeight: '800'}}>AVAILABLE</p>
                  <b style={{fontSize: '24px'}}>${partnerData.available.toLocaleString()}</b>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', marginBottom: '24px' }}>Leaderboard 🏆</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
                 <span style={{ fontSize: '12px', fontWeight: '800' }}>#2 Bo Sepehri</span>
                 <b style={{ fontSize: '12px' }}>$125k</b>
              </div>
            </div>
          </div>

          {/* YIELD PROJECTION */}
          <div style={{ ...s.card, backgroundColor: '#0f172a', color: '#fff' }}>
            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Yield Projector 📈</h3>
            <h2 style={{ fontSize: '36px', fontWeight: '900', margin: '0' }}>$180,000<span style={{ fontSize: '14px', color: '#10b981' }}>/yr</span></h2>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', marginTop: '10px' }}>10 STORES @ $50K VOL</p>
          </div>
        </div>

        {/* LISTING AGENT UNIVERSITY */}
        <div style={{ marginTop: '32px' }}>
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', margin: 0 }}>
                  📚 Listing Agent University
                </h3>
                <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
                  Training modules, compliance rules, and material resources for listing on Bazaria.
                </p>
              </div>
              <span style={{ backgroundColor: '#f0fdf4', color: '#166534', ...s.badge }}>All Materials Ready</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  1. Basic Seller Onboarding
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Understand the basics of helping merchants get their storefronts operational.
                </p>
                <button style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}>
                  Launch Module
                </button>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  2. Listings & Auction Mechanics
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Learn how to use Bazaria's Web3 tools to list products.
                </p>
                <button style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}>
                  Launch Module
                </button>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  3. Compliance & Payouts
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Review 1099 compliance and track residuals and payouts.
                </p>
                <button style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}>
                  Launch Module
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 🎛️ INJECT VOLUME: RESPONSIVE SIDE-DRAWER WITH WEEKLY MARKETING FLYERS */}
        {isVolumeMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(2, 6, 17, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
            fontFamily: 'sans-serif'
          }} onClick={() => setIsVolumeMenuOpen(false)}>
            
            {/* PANEL BODY */}
            <div style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#0b1329',
              borderLeft: '1px solid #1e293b',
              height: '100%',
              padding: '32px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* CLOSE BUTTON */}
              <button 
                onClick={() => setIsVolumeMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>

              {/* PANEL HEADER */}
              <div>
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#FFBF00', letterSpacing: '1px', backgroundColor: 'rgba(255, 191, 0, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255, 191, 0, 0.2)' }}>
                  Volume Accelerator
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, margin: '14px 0 4px 0', color: '#fff' }}>
                  Inject Market Volume
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                  Select an enterprise activity to accelerate your transaction volume and push your ledger closer to the $500 payout threshold.
                </p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: 0 }} />

              {/* 🔥 NEW FEATURE: WEEKLY MARKETING FLYERS */}
              <div style={{
                backgroundColor: '#030712',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyBetween: 'space-between' }}>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Download Weekly Flyers</h4>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                      Grab this week's high-converting social assets. Tag them on social media with your partner link to organically capture deal volume.
                    </p>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#0d9488', backgroundColor: 'rgba(13, 148, 136, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(13, 148, 136, 0.2)', textTransform: 'uppercase' }}>
                    NEW
                  </span>
                </div>

                {/* VISUAL ASSET PLACEHOLDERS */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <div style={{
                    flex: 1,
                    height: '60px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px dashed #475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#94a3b8',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }} onClick={() => alert('Downloading: Premium Auto Pack Flyer.jpg')}>
                    🚗 AUTO FLYER
                  </div>
                  <div style={{
                    flex: 1,
                    height: '60px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px dashed #475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#94a3b8',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }} onClick={() => alert('Downloading: Luxury Estate Pack Flyer.jpg')}>
                    🏠 REAL ESTATE
                  </div>
                </div>
              </div>

              {/* ACTION LINK 2: ACTIVE INVENTORY LISTING SHORTCUT */}
              <div style={{
                backgroundColor: '#030712',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Deploy New Active Listing</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    Post a new verified car package or real estate asset. Live marketplace inventory attracts direct orders to clear your milestone.
                  </p>
                </div>
                <button style={{
                  backgroundColor: '#0d9488',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Go to Inventory Manager →
                </button>
              </div>

              {/* ACTION LINK 3: COPY NETWORKING LINKS */}
              <div style={{
                backgroundColor: '#030712',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Circulate Partner Routing</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    Distribute your secure console routing links directly to your localized buyer networks to accelerate closed deals.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => { alert('Merchant Link Copied!'); }} style={{
                    backgroundColor: 'transparent',
                    color: '#FFBF00',
                    border: '1px solid #FFBF00',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    📋 COPY MERCHANT ROUTE LINK
                  </button>
                  <button onClick={() => { alert('Partner Link Copied!'); }} style={{
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    📋 COPY REGIONAL PARTNER LINK
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
    </div>
  );
}
