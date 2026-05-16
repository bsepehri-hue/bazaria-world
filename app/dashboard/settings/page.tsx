"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { db, auth } from "@/lib/firebase/client";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TopNav from "@/app/components/ui/TopNav";
import { User, Store, CreditCard, Shield, Save, Loader2, Camera, Image as ImageIcon } from "lucide-react";

type SettingsTab = "ACCOUNT" | "BRANDING" | "PAYOUT";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // --- State Configuration ---
  const [activeTab, setActiveTab] = useState<SettingsTab>("ACCOUNT");
  const [isMerchant, setIsMerchant] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storeDocId, setStoreDocId] = useState<string | null>(null);

  // --- Upload State Trackers ---
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  // --- Form Field States ---
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [themeColor, setThemeColor] = useState("#014d4e");
  const [supportEmail, setSupportEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // --- Auth & Profile Sync Protection ---
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function checkMerchantStatus() {
      try {
        setDisplayName(user.displayName || "");
        
        const storefrontsRef = collection(db, "storefronts");
        const q = query(storefrontsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsMerchant(true);
          const storeDoc = querySnapshot.docs[0];
          setStoreDocId(storeDoc.id);
          const storeData = storeDoc.data();
          
          setStoreName(storeData.name || "");
          setStoreDescription(storeData.about || storeData.description || "");
          setThemeColor(storeData.themeColor || "#014d4e");
          setSupportEmail(storeData.email || user.email || "");
          setBusinessAddress(storeData.address || "");
          setLogoUrl(storeData.logoUrl || "");
          setBannerUrl(storeData.bannerUrl || "");
        }
      } catch (err) {
        console.error("Settings: Failed tracking profile footprint", err);
      } finally {
        setPageLoading(false);
      }
    }

    checkMerchantStatus();
  }, [user, authLoading, router]);

  // --- 📷 Firebase Asset Upload Processors ---
  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'LOGO' | 'BANNER') => {
    const file = e.target.files?.[0];
    if (!file || !user || !storeDocId) return;

    try {
      if (target === 'LOGO') setLogoUploading(true);
      if (target === 'BANNER') setBannerUploading(true);

      const storage = getStorage();
      const fileExt = file.name.split('.').pop();
      const storagePath = `storefronts/${user.uid}/${target.toLowerCase()}_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, storagePath);

      // Push raw bytes data directly up to Firebase cloud buckets
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Commit URL path straight down into Firestore storefront profile
      const storeRef = doc(db, "storefronts", storeDocId);
      if (target === 'LOGO') {
        await updateDoc(storeRef, { logoUrl: downloadUrl });
        setLogoUrl(downloadUrl);
      } else {
        await updateDoc(storeRef, { bannerUrl: downloadUrl });
        setBannerUrl(downloadUrl);
      }

    } catch (err) {
      console.error(`Settings Asset Upload Error [${target}]:`, err);
      alert("Failed to secure and upload image asset.");
    } finally {
      setLogoUploading(false);
      setBannerUploading(false);
    }
  };

  // --- Save Operations Intercept ---
  const handleSaveConfiguration = async () => {
    if (!user) return;
    try {
      setIsSaving(true);

      if (isMerchant && storeDocId) {
        const storeRef = doc(db, "storefronts", storeDocId);
        await updateDoc(storeRef, {
          name: storeName,
          about: storeDescription,
          description: storeDescription,
          themeColor: themeColor,
          email: supportEmail,
          address: businessAddress
        });
      }

      alert("Configuration metrics locked in successfully! ✨");
    } catch (err) {
      console.error("Settings Update Fault:", err);
      alert("Failed to sync parameters safely.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", display: "flex", alignItems: "center", justifyContent: "center", color: "#C5A059" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
  <div style={{ minHeight: "100vh", backgroundColor: "#fcfdfe", color: "#0f172a", position: "relative", overflowX: "hidden" }}>
    <TopNav />

    {/* 🎯 INJECTING NATIVE MOBILE LAYOUT OVERRIDES */}
    <style jsx global>{`
      @media (max-w: 768px) {
        .responsive-settings-grid {
          grid-template-columns: 1fr !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 20px !important;
        }
        .settings-sidebar-column {
          width: 100% !important;
          flex-direction: row !important;
          overflow-x: auto !important;
          white-space: nowrap !important;
          padding: 12px !important;
        }
        .settings-tab-btn {
          padding: 10px 14px !important;
          font-size: 11px !important;
        }
      }
    `}</style>

    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>System Control Settings</h1>
        <p style={styles.subtitle}>Configure account identity metrics, secure payout channels, and storefront design engines.</p>
      </div>

      {/* Added className flags to latch onto your mobile queries */}
      <div className="responsive-settings-grid" style={styles.layoutGrid}>
        {/* LEFT UTILITY SIDEBAR */}
        <div className="settings-sidebar-column" style={styles.tabColumn}>
          <button onClick={() => setActiveTab("ACCOUNT")} className="settings-tab-btn" style={{...styles.tabBtn, backgroundColor: activeTab === "ACCOUNT" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "ACCOUNT" ? "#C5A059" : "#cbd5e1"}}>
            <User size={16} /> Individual Account
          </button>

          {isMerchant && (
            <>
              <button onClick={() => setActiveTab("BRANDING")} className="settings-tab-btn" style={{...styles.tabBtn, backgroundColor: activeTab === "BRANDING" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "BRANDING" ? "#C5A059" : "#cbd5e1"}}>
                <Store size={16} /> Storefront Boutique
              </button>
              <button onClick={() => setActiveTab("PAYOUT")} className="settings-tab-btn" style={{...styles.tabBtn, backgroundColor: activeTab === "PAYOUT" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "PAYOUT" ? "#C5A059" : "#cbd5e1"}}>
                <CreditCard size={16} /> Payout & Gateway
              </button>
            </>
          )}
        </div>

        {/* RIGHT ACTION MANAGEMENT PANEL */}
        <div style={styles.contentPanel}>
          {/* ... keeping your internal tab inputs exactly identical ... */}
            
            {/* TAB 1: CONSUMER ACCOUNT METRICS */}
            {activeTab === "ACCOUNT" && (
              <div>
                <h3 style={styles.panelTitle}>Identity Information</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ACCOUNT USERNAME</label>
                  <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>SECURE REGISTERED EMAIL</label>
                  <input type="email" value={user?.email || ""} disabled style={{...styles.input, opacity: 0.5, cursor: "not-allowed"}} />
                </div>
              </div>
            )}

            {/* TAB 2: MERCHANT BRANDING & ARTWORK MANAGEMENT */}
            {activeTab === "BRANDING" && isMerchant && (
              <div>
                <h3 style={styles.panelTitle}>Storefront Media & Assets</h3>
                
                {/* Visual Artwork Managers Grid Section */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
                  
                  {/* 🟢 STOREFRONT LOGO CIRCLE MEDIA MANAGER */}
                  <div>
                    <label style={styles.label}>BOUTIQUE LOGO DESIGN (CIRCLE AVATAR)</label>
                    <div style={styles.logoUploadCard}>
                      <div style={styles.logoPreviewWrapper}>
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Store size={28} color="#C5A059" />
                        )}
                        {logoUploading && <div style={styles.uploadOverlay}><Loader2 className="animate-spin" color="#FFBF00" size={16} /></div>}
                      </div>
                      <button type="button" style={styles.uploadTriggerBtn} onClick={() => fileInputRef.current?.click()} disabled={logoUploading}>
                        <Camera size={14} style={{ marginRight: "6px" }} /> Change Logo
                      </button>
                      <input type="file" ref={fileInputRef} onChange={(e) => handleAssetUpload(e, 'LOGO')} accept="image/*" style={{ display: "none" }} />
                    </div>
                  </div>

                  {/* 🟢 STOREFRONT HERO BANNER MEDIA MANAGER */}
                  <div>
                    <label style={styles.label}>LANDING BACKGROUND HERO BANNER</label>
                    <div style={styles.bannerUploadCard}>
                      <div style={{...styles.bannerPreviewWrapper, backgroundImage: bannerUrl ? `url("${bannerUrl}")` : "none"}}>
                        {!bannerUrl && <ImageIcon size={28} color="#C5A059" />}
                        {bannerUploading && <div style={styles.uploadOverlay}><Loader2 className="animate-spin" color="#FFBF00" size={16} /></div>}
                      </div>
                      <button type="button" style={styles.uploadTriggerBtn} onClick={() => bannerInputRef.current?.click()} disabled={bannerUploading}>
                        <Camera size={14} style={{ marginRight: "6px" }} /> Update Banner
                      </button>
                      <input type="file" ref={bannerInputRef} onChange={(e) => handleAssetUpload(e, 'BANNER')} accept="image/*" style={{ display: "none" }} />
                    </div>
                  </div>

                </div>

                <h3 style={styles.panelTitle}>Storefront Visual Engine Text</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>PUBLIC BOUTIQUE NAME</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>BRAND KEYWAY COLOR THEME</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }} />
                    <span style={{ color: '#ffffff', fontSize: '12px', fontFamily: 'monospace' }}>{themeColor.toUpperCase()}</span>
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>OUR STORY / ABOUT BLOCK</label>
                  <textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} style={styles.textarea} />
                </div>
              </div>
            )}

            {/* TAB 3: STRIPE GATEWAY CLEARING HOUSE */}
            {activeTab === "PAYOUT" && isMerchant && (
              <div>
                <h3 style={styles.panelTitle}>Financial Payout Gateway</h3>
                <p style={styles.panelDesc}>Connect your corporate banking vectors through secure Stripe processing layers. All platform commission matrixes resolve automatically on asset transfers.</p>
                <button type="button" style={styles.stripeBtn} onClick={() => alert("Stripe Integration Sandbox Ready for Corporate Launch Monday! ⚡")}>
                  ⚡ Connect Stripe Account
                </button>
                
                <h3 style={{...styles.panelTitle, marginTop: '40px'}}>Logistics & Fulfillment Hub</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>BUSINESS DISPATCH HOUSENUMBER ADDRESS (UPS/FEDEX FREIGHT COORDINATES)</label>
                  <input type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Enter full collection facilities address" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CUSTOMER INQUIRY CONCIERGE EMAIL</label>
                  <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} style={styles.input} />
                </div>
              </div>
            )}

            {/* CENTRAL PROCESSING SAVE BAR */}
            <div style={styles.footer}>
              <button onClick={handleSaveConfiguration} disabled={isSaving} style={styles.saveBtn}>
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                <span style={{ marginLeft: "8px" }}>Commit Updates</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "40px auto", padding: "0 40px" },
  header: { marginBottom: "32px" },
  title: { color: "#004d40", fontSize: "24px", fontWeight: 1000, margin: 0, textTransform: "uppercase" as const, letterSpacing: "-0.01em" },
  subtitle: { color: "#64748b", fontSize: "13px", marginTop: "6px", lineHeight: "1.5" },
  layoutGrid: { display: "grid", gridTemplateColumns: "280px 1fr", gap: "32px", alignItems: "start" },
  tabColumn: { display: "flex", flexDirection: "column" as const, gap: "8px", backgroundColor: "#05292e", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" },
  tabBtn: { display: "flex", alignItems: "center", gap: "12px", border: "none", padding: "12px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 800, cursor: "pointer", transition: "all 0.15s ease", textAlign: "left" as const },
  contentPanel: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "32px", position: "relative" as const },
  panelTitle: { color: "#ffffff", fontSize: "14px", fontWeight: 900, margin: "0 0 20px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.03em" },
  panelDesc: { color: "#cbd5e1", fontSize: "12px", lineHeight: "1.6", margin: "0 0 20px 0" },
  inputGroup: { marginBottom: "20px" },
  label: { color: "#C5A059", fontSize: "9px", fontWeight: 900, display: "block", marginBottom: "8px", letterSpacing: "0.05em" },
  input: { width: "100%", backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px 16px", color: "#ffffff", fontSize: "13px", outline: "none" },
  textarea: { width: "100%", backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px 16px", color: "#ffffff", fontSize: "13px", outline: "none", minHeight: "120px", resize: "vertical" as const, fontFamily: "sans-serif" },
  stripeBtn: { backgroundColor: "#635bff", color: "#ffffff", border: "none", borderRadius: "8px", padding: "12px 20px", fontSize: "12px", fontWeight: 800, cursor: "pointer" },
  footer: { borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "32px", paddingTop: "20px", display: "flex", justifyContent: "flex-end" },
  saveBtn: { display: "flex", alignItems: "center", backgroundColor: "#FFBF00", color: "#021a1d", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "12px", fontWeight: 900, cursor: "pointer" },
  
  // 📷 Added Media Uplink Styles Layout
  logoUploadCard: { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "#021a1d", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" },
  logoPreviewWrapper: { position: "relative" as const, width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #C5A059", backgroundColor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  bannerUploadCard: { display: "flex", flexDirection: "column" as const, gap: "12px", backgroundColor: "#021a1d", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" },
  bannerPreviewWrapper: { position: "relative" as const, width: "100%", height: "64px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", backgroundSize: "cover", backgroundPosition: "center" },
  uploadOverlay: { position: "absolute" as const, inset: 0, backgroundColor: "rgba(2, 26, 29, 0.7)", display: "flex", alignItems: "center", justifyBox: "center", justifyContent: "center" },
  uploadTriggerBtn: { display: "inline-flex", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", fontSize: "11px", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: 700, transition: "background-color 0.2s" }
};
