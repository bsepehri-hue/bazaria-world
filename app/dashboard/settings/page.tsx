"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase/client";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TopNav from "@/app/components/ui/TopNav";
import { User, Store, CreditCard, Save, Loader2, Camera, Image as ImageIcon, FileText, ShieldAlert } from "lucide-react";

type SettingsTab = "ACCOUNT" | "BRANDING" | "PAYOUT" | "LEGAL";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // --- Core State Machine ---
  const [activeTab, setActiveTab] = useState<SettingsTab>("ACCOUNT");
  const [isMerchant, setIsMerchant] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storeDocId, setStoreDocId] = useState<string | null>(null);

  // --- Asset Upload Trackers ---
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  // --- Form Target Mappings ---
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [myStory, setMyStory] = useState("");
  const [themeColor, setThemeColor] = useState("#014d4e");
  const [supportEmail, setSupportEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [termsUrl, setTermsUrl] = useState("");
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // --- Document Stream Protection ---
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
          setMerchantName(storeData.merchantName || storeData.name || "");
          setMyStory(storeData.about || storeData.description || "");
          setThemeColor(storeData.themeColor || "#014d4e");
          setSupportEmail(storeData.email || user.email || "");
          setBusinessAddress(storeData.address || "");
          setLogoUrl(storeData.logoUrl || "");
          setBannerUrl(storeData.bannerUrl || "");
          setTermsUrl(storeData.termsUrl || "");
          setPrivacyUrl(storeData.privacyUrl || "");
        }
      } catch (err) {
        console.error("Settings Processing Intercept Error:", err);
      } finally {
        setPageLoading(false);
      }
    }

    checkMerchantStatus();
  }, [user, authLoading, router]);

  // --- Asset Upload Pipeline ---
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

      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const storeRef = doc(db, "storefronts", storeDocId);
      if (target === 'LOGO') {
        await updateDoc(storeRef, { logoUrl: downloadUrl });
        setLogoUrl(downloadUrl);
      } else {
        await updateDoc(storeRef, { bannerUrl: downloadUrl });
        setBannerUrl(downloadUrl);
      }
    } catch (err) {
      console.error("Asset Stream Intercept Fault:", err);
    } finally {
      setLogoUploading(false);
      setBannerUploading(false);
    }
  };

  // --- Global Save Intercept ---
  const handleSaveConfiguration = async () => {
    if (!user) return;
    try {
      setIsSaving(true);

      if (isMerchant && storeDocId) {
        const storeRef = doc(db, "storefronts", storeDocId);
        await updateDoc(storeRef, {
          name: storeName,
          merchantName: merchantName,
          about: myStory,
          description: myStory,
          themeColor: themeColor,
          email: supportEmail,
          address: businessAddress,
          termsUrl: termsUrl,
          privacyUrl: privacyUrl
        });
      }

      alert("Configuration metrics successfully written to the Bazaria economy! ⚡");
    } catch (err) {
      console.error("Database Save Intercept Fault:", err);
      alert("Failed to commit security updates.");
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
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", position: "relative", overflowX: "hidden" }}>
      <TopNav />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 my-10 pb-20">
        
        {/* HEADER BRAND BLOCK */}
        <div className="mb-10">
          <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px" }}>System Control Settings</h1>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Configure identity metrics, legal files, financial paths, and public storefront blocks.</p>
        </div>

        {/* RESPONSIVE LAYOUT ENGINE: Stacks on mobile, splits on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* LEFT COLUMN NAVIGATION ROW/STACK */}
          <div className="w-full flex flex-row md:flex-col gap-2 bg-[#05292e] p-4 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap md:whitespace-normal box-border">
            <button onClick={() => setActiveTab("ACCOUNT")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "ACCOUNT" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "ACCOUNT" ? "#C5A059" : "#94a3b8" }}>
              <User size={14} /> Account Base
            </button>

            {isMerchant && (
              <>
                <button onClick={() => setActiveTab("BRANDING")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "BRANDING" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "BRANDING" ? "#C5A059" : "#94a3b8" }}>
                  <Store size={14} /> Storefront Boutique
                </button>
                <button onClick={() => setActiveTab("PAYOUT")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "PAYOUT" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "PAYOUT" ? "#C5A059" : "#94a3b8" }}>
                  <CreditCard size={14} /> Concierge & Logistics
                </button>
                <button onClick={() => setActiveTab("LEGAL")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "LEGAL" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "LEGAL" ? "#C5A059" : "#94a3b8" }}>
                  <FileText size={14} /> Governance & Rules
                </button>
              </>
            )}
          </div>

          {/* RIGHT PANELS CONTROL CENTER */}
          <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "32px", width: "100%", boxSizing: "border-box" }}>
            
            {/* TAB 1: BASIC ACCOUNT PROFILE */}
            {activeTab === "ACCOUNT" && (
              <div>
                <h3 style={styles.panelTitle}>Identity Framework</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ACCOUNT USERNAME</label>
                  <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>SECURE REGISTERED EMAIL</label>
                  <input type="email" value={user?.email || ""} disabled style={{...styles.input, opacity: 0.4, cursor: "not-allowed"}} />
                </div>
              </div>
            )}

            {/* TAB 2: STOREFRONT BOUTIQUE BRANDING & IMAGES */}
            {activeTab === "BRANDING" && isMerchant && (
              <div>
                <h3 style={styles.panelTitle}>Storefront Media & Assets</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={styles.label}>BOUTIQUE LOGO (CIRCLE AVATAR)</label>
                    <div style={styles.mediaUploadCard}>
                      <div style={styles.logoPreviewWrapper}>
                        {logoUrl ? <img src={logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Store size={24} color="#C5A059" />}
                        {logoUploading && <div style={styles.uploadOverlay}><Loader2 className="animate-spin" color="#FFBF00" size={16} /></div>}
                      </div>
                      <button type="button" style={styles.uploadTriggerBtn} onClick={() => fileInputRef.current?.click()}>
                        <Camera size={12} style={{ marginRight: "6px" }} /> Change Logo
                      </button>
                      <input type="file" ref={fileInputRef} onChange={(e) => handleAssetUpload(e, 'LOGO')} accept="image/*" style={{ display: "none" }} />
                    </div>
                  </div>

                  <div>
                    <label style={styles.label}>LANDING HERO BANNER</label>
                    <div style={styles.mediaUploadCard}>
                      <div style={{...styles.bannerPreviewWrapper, backgroundImage: bannerUrl ? `url("${bannerUrl}")` : "none"}}>
                        {!bannerUrl && <ImageIcon size={24} color="#C5A059" />}
                        {bannerUploading && <div style={styles.uploadOverlay}><Loader2 className="animate-spin" color="#FFBF00" size={16} /></div>}
                      </div>
                      <button type="button" style={styles.uploadTriggerBtn} onClick={() => bannerInputRef.current?.click()}>
                        <Camera size={12} style={{ marginRight: "6px" }} /> Update Banner
                      </button>
                      <input type="file" ref={bannerInputRef} onChange={(e) => handleAssetUpload(e, 'BANNER')} accept="image/*" style={{ display: "none" }} />
                    </div>
                  </div>
                </div>

                <h3 style={styles.panelTitle}>Visual Canvas Settings</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>PUBLIC HEADER DISPLAY NAME</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>BRAND THEME ACCENT COLOR</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} style={{ width: '45px', height: '36px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }} />
                    <span style={{ color: '#C5A059', fontSize: '12px', fontFamily: 'monospace', fontWeight: 700 }}>{themeColor.toUpperCase()}</span>
                  </div>
                </div>

                <h3 style={styles.panelTitle}>Boutique Core Narrative</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ABOUT MERCHANT / SIGN-OFF TITLE</label>
                  <input type="text" value={merchantName} onChange={(e) => setMerchantName(e.target.value)} placeholder="e.g., Modern Art" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>MY STORY NARRATIVE BLOCK (FOOTER ACCENT TEXT)</label>
                  <textarea value={myStory} onChange={(e) => setMyStory(e.target.value)} style={styles.textarea} />
                </div>
              </div>
            )}

            {/* TAB 3: CONCIERGE & CLEARING LOGISTICS */}
            {activeTab === "PAYOUT" && isMerchant && (
              <div>
                <h3 style={styles.panelTitle}>Financial Payout Gateway</h3>
                <p style={styles.panelDesc}>Wire your corporate banking routes safely into our secure Stripe clearing layer to manage your platform payouts.</p>
                <button type="button" style={styles.stripeBtn} onClick={() => alert("Stripe Engine Sandbox Activated! Onboarding launches Monday. ⚡")}>
                  ⚡ Connect Stripe Account
                </button>
                
                <h3 style={{...styles.panelTitle, marginTop: '40px'}}>Concierge Contact Information</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>BUSINESS REMITTANCE DISPATCH ADDRESS (FOR FREIGHT & OFFICIAL CHECKS)</label>
                  <input type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CONCIERGE CUSTOMER CHANNELS EMAIL</label>
                  <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} style={styles.input} />
                </div>
              </div>
            )}

            {/* TAB 4: GOVERNANCE, TERMS & PRIVACY */}
            {activeTab === "LEGAL" && isMerchant && (
              <div>
                <h3 style={styles.panelTitle}>Merchant Governance Configurations</h3>
                <p style={styles.panelDesc}>Provide your storefront instances with specialized rule document hyperlinks to govern micro-economy transactions.</p>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>TERMS OF SERVICE LINK PATH (URL)</label>
                  <input type="text" value={termsUrl} onChange={(e) => setTermsUrl(e.target.value)} placeholder="https://bazaria.world/legal/terms" style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>PRIVACY POLICY LINK PATH (URL)</label>
                  <input type="text" value={privacyUrl} onChange={(e) => setPrivacyUrl(e.target.value)} placeholder="https://bazaria.world/legal/privacy" style={styles.input} />
                </div>
              </div>
            )}

            {/* GLOBAL COMMIT BAR */}
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
  panelTitle: { color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: "0 0 20px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px", letterSpacing: "0.02em" },
  panelDesc: { color: "#cbd5e1", fontSize: "12px", lineHeight: "1.6", margin: "0 0 20px 0" },
  inputGroup: { marginBottom: "20px" },
  label: { color: "#C5A059", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "8px", letterSpacing: "0.05em" },
  input: { width: "100%", backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px 16px", color: "#ffffff", fontSize: "13px", outline: "none" },
  textarea: { width: "100%", backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px 16px", color: "#ffffff", fontSize: "13px", outline: "none", minHeight: "120px", resize: "vertical" as const, fontFamily: "sans-serif", lineHeight: "1.6" },
  stripeBtn: { backgroundColor: "#635bff", color: "#ffffff", border: "none", borderRadius: "8px", padding: "12px 20px", fontSize: "12px", fontWeight: 800, cursor: "pointer" },
  footer: { borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "32px", paddingTop: "20px", display: "flex", justifyContent: "flex-end" },
  saveBtn: { display: "flex", alignItems: "center", backgroundColor: "#FFBF00", color: "#021a1d", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "12px", fontWeight: 900, cursor: "pointer" },
  mediaUploadCard: { display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#021a1d", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" },
  logoPreviewWrapper: { position: "relative" as const, width: "60px", height: "60px", borderRadius: "50%", border: "2px solid #C5A059", backgroundColor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 },
  bannerPreviewWrapper: { position: "relative" as const, width: "120px", height: "60px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 },
  uploadOverlay: { position: "absolute" as const, inset: 0, backgroundColor: "rgba(2, 26, 29, 0.7)", display: "flex", alignItems: "center", justifyContent: "center" },
  uploadTriggerBtn: { display: "inline-flex", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", fontSize: "11px", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }
}; // 🎯 The closing bracket belongs cleanly here at the very end of the definitions
