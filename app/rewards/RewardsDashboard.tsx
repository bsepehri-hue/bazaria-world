"use client";


import React, { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/client"; 
import { useAuth } from "@/app/providers/AuthProvider"; 
import { 
  doc, onSnapshot, updateDoc, collection, 
  query, where, serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { getProductCode } from "@/lib/utils"; 
import MilestoneTracker from '@/components/MilestoneTracker';
import { Zap, Building2, UserPlus } from "lucide-react";

// 🛡️ 1. Define the interfaces
interface Inquiry {
  id: string;
  customer_id: string;
  subject: string;
  message: string;
  created_at: string;
  product_code?: string;
}

// 🏢 NEW: Define what a Corporate Lead looks like for the "Grab" engine
interface CorporateLead {
  id: string;
  companyName: string;
  industry: string;
  estimatedListings: string;
  status: string;
}

// 🚀 2. THE MAIN COMPONENT
export default function RewardsDashboard() { // 🎯 Use 'export default' here
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [partnerData, setPartnerData] = useState({
    paid: 15000.00,
    available: 540.00,
    credits: 12,
    listings: 5,
    tier: "Elite Partner (M5)",
    name: "Bo Dango",
    academyLevel: 3,
    volumeCapacity: 5000000
  });

  const [corporateLeads, setCorporateLeads] = useState<CorporateLead[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [agentAvatar, setAgentAvatar] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [agentFields, setAgentFields] = useState({
    email: "xavier@bazaria.agency",
    phone: "+1 (305) 555-7742",
    location: "Miami, FL"
  });

useEffect(() => {
    if (authLoading || !user?.uid) return; // 🛡️ Safety Gate: Don't run if user is null

    // Pipeline A: Partner Metrics
    const unsubPartner = onSnapshot(doc(db, "partners", user.uid), (docSnap) => {
      if (docSnap.exists()) setPartnerData(prev => ({ ...prev, ...docSnap.data() }));
    });
  
 // Pipeline B: Core User Profile
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setAgentFields({
          email: userData.email || user.email || "xavier@bazaria.agency",
          phone: userData.phone || "+1 (305) 555-7742",
          location: userData.location || "Miami, FL"
        });
        if (userData.avatarUrl || userData.photoURL || userData.imageUrl) {
          setAgentAvatar(userData.avatarUrl || userData.photoURL || userData.imageUrl);
        }
      }
    });

    // 🏢 🛰️ STREAM AVAILABLE CORPORATE PARTNERS
    const qPartners = query(
      collection(db, "partner_intake"),
      where("status", "==", "available")
    );
    const unsubLeads = onSnapshot(qPartners, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CorporateLead[];
      setCorporateLeads(leads);
    });

    // 🔌 THIS IS THE ONLY RETURN THAT SHOULD BE HERE
    return () => {
      unsubPartner();
      unsubUser();
      unsubLeads();
    };
  }, [user, authLoading]); // <--- This closes the WHOLE effect.
  
  // 🔌 WIRE 1: STREAM PARTNER METRICS & CORE PROFILE USER DOCUMENT LIVE
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?callback=/rewards");
      return;
    }

    // Pipeline A: Listen to specific Partner Revenue tier stats
    const unsubPartner = onSnapshot(doc(db, "partners", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setPartnerData(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoadingData(false);
    });

    // Pipeline B: Listen directly to core user document records for operational handles
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setAgentFields({
          email: userData.email || user.email || "xavier@bazaria.agency",
          phone: userData.phone || "+1 (305) 555-7742",
          location: userData.location || "Miami, FL"
        });
        if (userData.avatarUrl || userData.photoURL || userData.imageUrl) {
          setAgentAvatar(userData.avatarUrl || userData.photoURL || userData.imageUrl);
        }
      }
    });

    return () => {
      unsubPartner();
      unsubUser();
    };
  }, [user, authLoading, router]);

  // Stream active lead inquiries from API
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

  // 🔌 WIRE 2: FIREBASE STORAGE CLOUD PICTURE UPLOAD PIPELINE
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Fast local browser string cache fallback preview injection
    const localUrl = URL.createObjectURL(file);
    setAgentAvatar(localUrl);
    setIsUploadingAvatar(true);

    try {
      // Build an exclusive storage file root node using the user's authentication UID hash handle
      const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
      
      // Dispatch file buffer data array stream to Firebase Cloud Buckets
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Download the finalized public content CDN address link
      const permanentCloudUrl = await getDownloadURL(uploadResult.ref);

      // Write url data block back into core user Firestore documents permanently
      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: permanentCloudUrl
      });

      setAgentAvatar(permanentCloudUrl);
      alert("Identity headshot synced with secure cloud storage successfully!");
    } catch (err) {
      console.error("Failed to upload profile picture to cloud:", err);
      alert("Cloud sync failed. Preserving localized memory runtime path.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Profile Information Save Data Action
  const handleSaveProfileFields = async () => {
    if (!user) return;
    try {
      // Push direct string inputs straight down to account profile nodes
      await updateDoc(doc(db, "users", user.uid), {
        name: partnerData.name,
        phone: agentFields.phone,
        location: agentFields.location,
        email: agentFields.email
      });
      setIsEditingProfile(false);
      alert("Operational records updated live successfully.");
    } catch (err) {
      console.error("Failed to update profile nodes:", err);
      alert("Failed to write fields to authentication registry.");
    }
  };

  // 🎯 FUNCTION 1: Standard Inquiry Claim
  const handleClaim = async (inquiryId: string) => {
    if (!user) return;
    setClaimingId(inquiryId);
    try {
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

  // 🎯 FUNCTION 2: Corporate Partner Intake Claim
  const handleClaimPartner = async (leadId: string) => {
    if (!user) return;
    try {
      const leadRef = doc(db, "partner_intake", leadId);
      await updateDoc(leadRef, {
        status: "assigned",
        agentUid: user.uid,
        claimedAt: serverTimestamp(),
      });
      alert("Corporate Stewardship Secured! Check your Managed Partners.");
    } catch (err) {
      console.error("Claim failed:", err);
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
          <MilestoneTracker currentLtb={340} targetLtb={500} />
        </div>

        {/* 🎛️ NAVIGATION WORKSPACE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
          fontFamily: 'sans-serif'
        }}>
          {['Overview', 'Active Marketplace', 'Live Support Desk', 'Credentials & Vault'].map((tabName) => {
            const isActive = activeTab === tabName; 
            return (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)} 
                style={{
                  background: isActive ? '#FFBF00' : 'rgba(30, 41, 59, 0.3)',
                  color: isActive ? '#020617' : '#94a3b8',
                  border: isActive ? '1px solid #FFBF00' : '1px solid #1e293b',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tabName}
              </button>
            );
          })}
        </div>

        {/* 🎛️ INTEGRATED SPLIT COLUMNS VIEWPORTS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px',
          alignItems: 'flex-start',
          width: '100%',
          fontFamily: 'sans-serif'
        }}>
          
          {/* 👤 LEFT COLUMN: INTERACTIVE AGENT IDENTITY DATA HUB */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ ...s.card, position: 'relative' }}>
              
              <input 
                id="agent-avatar-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarChange} 
              />

              {!isEditingProfile ? (
                /* 🛡️ VIEW MODE: ELITE IDENTITY BADGE */
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      
                      <div 
                        onClick={() => {
                          const inputNode = document.getElementById('agent-avatar-upload');
                          if (inputNode) (inputNode as HTMLInputElement).click();
                        }}
                        style={{ 
                          width: '75px', 
                          height: '75px', 
                          backgroundColor: '#05292e', 
                          borderRadius: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '26px',
                          border: '1px solid #0d9488',
                          boxShadow: '0 8px 16px rgba(13, 148, 136, 0.15)',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        title="Click to Upload Profile Picture"
                      >
                        {agentAvatar ? (
                          <img src={agentAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isUploadingAvatar ? 0.4 : 1 }} />
                        ) : (
                          <span style={{ color: '#fff' }}>👤</span>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(5, 41, 46, 0.85)', color: '#0d9488', fontSize: '8px', fontWeight: 900, textAlign: 'center', padding: '2px 0' }}>
                          {isUploadingAvatar ? 'SYNC...' : 'UPLOAD'}
                        </div>
                      </div>

                      <div>
                        <h3 style={{ margin: 0, fontWeight: '1000', fontSize: '20px', color: '#0f172a', letterSpacing: '-0.5px' }}>
                          {partnerData.name}
                        </h3>
                        <span style={{ color: '#0d9488', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginTop: '2px' }}>
                          Certified Success Partner
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      style={{ backgroundColor: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '8px', padding: '4px 8px', fontSize: '9px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                      ⚙️ Edit Info
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div style={s.miniStat}>
                      <small style={{ color: '#94a3b8', fontWeight: '900', fontSize: '9px' }}>ACADEMY LEVEL</small><br/>
                      <b style={{ fontSize: '20px', color: '#f59e0b' }}>LVL {partnerData.academyLevel}</b>
                    </div>
                    <div style={s.miniStat}>
                      <small style={{ color: '#94a3b8', fontWeight: '900', fontSize: '9px' }}>VOLUME CAPACITY</small><br/>
                      <b style={{ fontSize: '18px', color: '#0f172a' }}>${(partnerData.volumeCapacity / 1000000).toFixed(1)}M</b>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f0fdf4', color: '#166534', ...s.badge, marginBottom: '12px', padding: '10px' }}>🟢 Status: Active Node</div>
                  <div style={{ backgroundColor: '#fffbeb', color: '#92400e', ...s.badge, border: '1px solid #fef3c7', padding: '10px' }}>💼 License Tier: {partnerData.tier}</div>

                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Direct Correspondence</span>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>{agentFields.email}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Secure Comm Line</span>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>{agentFields.phone}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Operational Hub</span>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>📍 {agentFields.location}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* ⚙️ EDIT MODE: TRANSACTIONAL ENTRY TERMINAL */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#05292e', textTransform: 'uppercase' }}>Update Account Profile</h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Full Professional Name</label>
                    <input 
                      type="text" 
                      value={partnerData.name} 
                      onChange={(e) => setPartnerData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontWeight: 600 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Correspondence Email</label>
                    <input 
                      type="email" 
                      value={agentFields.email} 
                      onChange={(e) => setAgentFields(prev => ({ ...prev, email: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontWeight: 600, fontFamily: 'monospace' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Secure Mobile Line</label>
                    <input 
                      type="text" 
                      value={agentFields.phone} 
                      onChange={(e) => setAgentFields(prev => ({ ...prev, phone: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontWeight: 600 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Operational Office Hub</label>
                    <input 
                      type="text" 
                      value={agentFields.location} 
                      onChange={(e) => setAgentFields(prev => ({ ...prev, location: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontWeight: 600 }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      style={{ flex: 1, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfileFields}
                      style={{ flex: 1, backgroundColor: '#0d9488', border: '1px solid #0d9488', color: '#ffffff', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* 🎛️ RIGHT COLUMN: DYNAMIC SUB-WORKSPACE CONSOLE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flexGrow: 2 }}>
            
            {/* TAB 1: OVERVIEW WORKSPACE */}
            {activeTab === 'Overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

{/* 🏢 CORPORATE STEWARDSHIP POOL */}
{corporateLeads.length > 0 && (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <Building2 size={20} color="#0d9488" />
      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Available Corporate Partners
      </h3>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {corporateLeads.map((lead) => (
        <div key={lead.id} style={{ ...s.card, border: '2px solid #0d9488', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#0d9488', color: '#fff', padding: '4px 12px', fontSize: '9px', fontWeight: 900 }}>
            AVAILABLE
          </div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900 }}>{lead.companyName}</h4>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{lead.industry} • {lead.estimatedListings} Est. Listings</p>
          
          <button 
            onClick={() => handleClaimPartner(lead.id)}
            style={{ 
              marginTop: '20px', 
              width: '100%', 
              backgroundColor: '#0f172a', 
              color: '#fff', 
              border: 'none', 
              padding: '10px', 
              borderRadius: '12px', 
              fontWeight: 900, 
              fontSize: '11px', 
              cursor: 'pointer' 
            }}
          >
            SECURE STEWARDSHIP
          </button>
        </div>
      ))}
    </div>
  </div>
)}

                
                {/* INQUIRY POOL */}
                <div style={{ marginBottom: '16px' }}>
                  {loadingInquiries ? (
                    <p style={{ color: '#0d9488', fontWeight: '600' }}>Checking for available pool inquiries...</p>
                  ) : inquiries.length === 0 ? (
                    <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ color: '#64748b', margin: 0, fontWeight: '600' }}>No new inquiries in the pool right now. Check back shortly!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                      {inquiries.map((inq) => {
                        const displayCode = inq.product_code || (inq.xid_chain?.parent ? getProductCode(inq.xid_chain.parent) : "GENERAL");
                        const cleanSubject = inq.subject.replace(/\s*\[Ref:\s*#[A-Z0-9]{5}\]/gi, "").replace(/\s*\[PROD-[A-Z0-9]{5}\]/gi, "");

                        return (
                          <div key={inq.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyStyle: 'space-between', minHeight: '230px', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', justifyStyle: 'space-between', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontWeight: 900 }}>UNASSIGNED LEAD</span>
                                <span style={{ fontSize: '10px', backgroundColor: '#05292e', color: '#FFBF00', border: '1px solid #FFBF00', padding: '4px 8px', borderRadius: '6px', fontWeight: 900, fontFamily: 'monospace' }}>#{displayCode}</span>
                              </div>
                              <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '900', color: '#0f172a' }}>{cleanSubject}</h4>
                              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', marginBottom: '20px' }}>{inq.message}</p>
                            </div>
                            <button onClick={() => handleClaim(inq.id)} disabled={claimingId === inq.id} style={{ width: '100%', backgroundColor: '#0d9488', border: 'none', color: '#fff', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '11px', cursor: claimingId === inq.id ? 'not-allowed' : 'pointer', opacity: claimingId === inq.id ? 0.6 : 1 }}>
                              {claimingId === inq.id ? 'CLAIMING...' : 'ACCEPT DEAL & ASSIGN'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={s.card}>
                    <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', color: '#475569', marginBottom: '20px' }}>Capital Flow</h3>
                    <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', margin: 0 }}>PAID</p>
                        <b style={{ fontSize: '22px', color: '#10b981' }}>${partnerData.paid.toLocaleString()}</b>
                      </div>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', margin: 0 }}>AVAILABLE</p>
                        <b style={{ fontSize: '22px', color: '#0f172a' }}>${partnerData.available.toLocaleString()}</b>
                      </div>
                    </div>
                  </div>

                  <div style={{ ...s.card, backgroundColor: '#0f172a', color: '#fff' }}>
                    <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>Yield Projector 📈</h3>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0' }}>$180,000<span style={{ fontSize: '13px', color: '#10b981' }}>/yr</span></h2>
                  </div>
                </div>
              </div>
            )}

            {/* 🚗 🔌 WIRE 3: ACTIVE MARKETPLACE REFERRAL ENGINE TAB */}
            {activeTab === 'Active Marketplace' && (
              <div style={{ backgroundColor: '#0b1329', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 900 }}>Global Marketplace Router</h4>
                  <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Grab secure tracking links to circulate inside your online channels.</p>
                </div>
                
                <div style={{ backgroundColor: '#030712', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', justifyStyle: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>🚗</div>
                    <div>
                      <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '13px' }}>2024 Porsche 911 GT3 RS</p>
                      <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                        Ref Hook: {user?.uid ? user.uid.substring(0, 6).toUpperCase() : 'BAZARIA'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const baseLink = `https://bazaria.world/market/asset/eL075y0u97M8oZqSJkqC`;
                      const refCode = user?.uid ? user.uid.substring(0, 6).toUpperCase() : 'BAZARIA';
                      navigator.clipboard.writeText(`${baseLink}?agentRef=${refCode}`);
                      alert('Custom Tracker Asset Referral Link Copied to Clipboard!');
                    }} 
                    style={{ backgroundColor: 'transparent', border: '1px solid #FFBF00', color: '#FFBF00', padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
                  >
                    Copy Tracked Link
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE SUPPORT DESK */}
            {activeTab === 'Live Support Desk' && (
              <div style={{ backgroundColor: '#0b1329', border: '1px solid #1e293b', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 900 }}>Ecosystem Support Stream</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>Incoming background tickets from your active nodes.</p>
              </div>
            )}

            {/* TAB 3: CREDENTIALS & VAULT */}
            {activeTab === 'Credentials & Vault' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                
                {/* 💳 BAZARIA DEBIT CARD CONTAINER */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '380px',
                  height: '220px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #05292e 50%, #022c22 100%)',
                  borderRadius: '24px',
                  padding: '24px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(20, 184, 166, 0.4)',
                  overflow: 'hidden',
                  margin: '0 auto',
                  fontFamily: 'sans-serif'
                }}>
                  <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.2) 0%, transparent 75%)', pointerEvents: 'none' }} />

                  <div style={{ display: 'flex', justifyStyle: 'space-between', alignItems: 'flex-start', zIndex: 2, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 1000, color: '#ffffff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>BAZARIA</h3>
                      <span style={{ fontSize: '7px', fontWeight: 900, color: '#FFBF00', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', display: 'block' }}>Sovereign Node</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><path d="M5 12h.01M8.5 8.5a5 5 0 0 1 0 7M12 5a10 10 0 0 1 0 14"/></svg>
                  </div>

                  <div style={{ width: '38px', height: '28px', background: 'linear-gradient(135deg, #FFBF00 0%, #d97706 100%)', borderRadius: '6px', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.15)', position: 'relative', zIndex: 2, marginTop: '10px' }} />

                  <div style={{ display: 'flex', justifyStyle: 'space-between', alignItems: 'flex-end', zIndex: 2, justifyContent: 'space-between' }}>
                    <div>
                      <code style={{ fontSize: '14px', color: '#e2e8f0', letterSpacing: '3px', fontWeight: 700, display: 'block', fontFamily: 'monospace' }}>••••  ••••  ••••  {agentFields.phone ? agentFields.phone.substring(agentFields.phone.length - 4) : '7742'}</code>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', marginTop: '12px', display: 'block', letterSpacing: '1px' }}>
                        {partnerData.name.split(' ')[0].toUpperCase()}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', fontWeight: 1000, color: '#FFBF00', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Vault</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0b1329', border: '1px solid #1e293b', borderRadius: '20px', padding: '20px', color: '#fff' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900 }}>Onboarding Compliance Check</h4>
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Verify your institutional license parameters to maintain active payout thresholds.</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 📚 LISTING AGENT HANDBOOK */}
        <div style={{ marginTop: '32px' }}>
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', margin: 0 }}>
                  📚 Listing Agent Handbook
                </h3>
                <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
                  Operational protocols, system tools, and expansion strategies for Bazaria Stewards.
                </p>
              </div>
              <span style={{ backgroundColor: '#f0fdf4', color: '#166534', ...s.badge }}>Protocols Active</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              
              {/* MODULE 1: ONBOARDING */}
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  1. Corporate Onboarding
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Execute the official Partner Intake protocol to register new corporate inventory.
                </p>
                <button 
                  onClick={() => router.push('/register/partner')}
                  style={{ width: '100%', backgroundColor: '#05292e', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#ffffff', cursor: 'pointer' }}
                >
                  Launch Onboarding Form
                </button>
              </div>

              {/* MODULE 2: SYSTEM PROTOCOLS */}
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  2. Operational Handbook
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Access technical manuals for listing mechanics, support, and expansion.
                </p>
                <button 
                  onClick={() => router.push('/handbook')}
                  style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}
                >
                  Open Handbook
                </button>
              </div>

             {/* MODULE 3: REFERRAL HUB */}
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  3. Expansion & Referrals
                </h4>
                
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: 900 }}>Referral Code</span>
                    <code style={{ fontSize: '12px', color: '#05292e', fontWeight: 900 }}>
                      BZ-AGENT-{user?.uid?.substring(0, 4).toUpperCase() || '7742'}
                    </code>
                  </div>
                  <button 
                    onClick={() => {
                      const code = `BZ-AGENT-${user?.uid?.substring(0, 4).toUpperCase() || '7742'}`;
                      navigator.clipboard.writeText(code);
                      alert('Code Copied!');
                    }}
                    style={{ backgroundColor: 'transparent', border: '1px solid #05292e', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}
                  >
                    Copy
                  </button>
                </div>

                <button 
                  onClick={() => router.push('/handbook/network')}
                  style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}
                >
                  Network Strategy
                </button>
              </div> 

            </div> 
          </div> 
        </div>

      </div> 
    </div> 
  );
}

const s = {
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
  },
};
