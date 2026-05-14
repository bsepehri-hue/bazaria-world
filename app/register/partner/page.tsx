"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Building2, UserPlus, UserCheck, ShieldCheck, Mail, Phone } from "lucide-react";

export default function ListingPartnerOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "Real Estate",
    website: "",
    estimatedListings: "1-10 Units",
    repName: "",
    repPhone: "",
    repEmail: "",
    agentCode: "", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadStatus = formData.agentCode.trim() !== "" ? "assigned" : "available";

      await addDoc(collection(db, "partner_intake"), {
        ...formData,
        status: leadStatus,
        createdAt: serverTimestamp(),
        type: "corporate_partner",
      });

      setSubmitted(true);
      setTimeout(() => router.push("/market"), 3000);
    } catch (error) {
      console.error("Onboarding Error:", error);
      alert("System sync failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <ShieldCheck size={48} color="#FFBF00" />
          <h1 style={styles.title}>Protocol Initiated</h1>
          <p style={styles.subtitle}>Your corporate profile is being synchronized with the Listing Agent network.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <Building2 size={24} color="#FFBF00" />
          <h1 style={styles.title}>Listing Partner Onboarding</h1>
          <p style={styles.subtitle}>Integrate your corporate inventory into the Bazaria Living Economy.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <label style={styles.label}>Company Name</label>
            <input 
              required
              style={styles.input}
              placeholder="GLOBAL ASSETS LTD"
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.section}>
              <label style={styles.label}>Industry Category</label>
              <select 
                style={styles.input}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
              >
                <option>Real Estate</option>
                <option>Auto Industry</option>
                <option>Trucks/RVs</option>
                <option>Heavy equipment and Machinery</option>
                <option>Professional services</option>
                <option>Business Activities</option>
                <option>Misc Products and Services</option>
              </select>
            </div>
            <div style={styles.section}>
              <label style={styles.label}>Inventory Scale</label>
              <select 
                style={styles.input}
                onChange={(e) => setFormData({...formData, estimatedListings: e.target.value})}
              >
                <option>1-10 Units</option>
                <option>10-100 Units</option>
                <option>100-1000 Units</option>
              </select>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Corporate Website</label>
            <input 
              style={styles.input}
              placeholder="https://your-company.com"
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
          </div>

          <hr style={styles.divider} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <UserPlus size={14} color="#FFBF00" />
            <label style={styles.label}>Point of Contact / Representative</label>
          </div>

          <div style={styles.section}>
            <input 
              required
              style={styles.input}
              placeholder="Full Name"
              onChange={(e) => setFormData({...formData, repName: e.target.value})}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.section}>
              <input 
                required
                type="tel"
                style={styles.input}
                placeholder="Phone Number"
                onChange={(e) => setFormData({...formData, repPhone: e.target.value})}
              />
            </div>
            <div style={styles.section}>
              <input 
                required
                type="email"
                style={styles.input}
                placeholder="Work Email"
                onChange={(e) => setFormData({...formData, repEmail: e.target.value})}
              />
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <UserCheck size={16} color="#FFBF00" />
              <label style={styles.label}>Steward Referral Code (Optional)</label>
            </div>
            <input 
              style={styles.agentInput}
              placeholder="AGENT-XXXXX"
              onChange={(e) => setFormData({...formData, agentCode: e.target.value.toUpperCase()})}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "SYNCHRONIZING..." : "SUBMIT PARTNER APPLICATION"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#021a1d", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "Inter, sans-serif" },
  formCard: { backgroundColor: "#05292e", width: "100%", maxWidth: "500px", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255, 191, 0, 0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
  successCard: { textAlign: "center" as const, color: "#fff" },
  header: { textAlign: "center" as const, marginBottom: "32px" },
  title: { color: "#FFBF00", fontSize: "20px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: "12px" },
  subtitle: { color: "#94a3b8", fontSize: "12px", marginTop: "8px", lineHeight: "1.6" },
  form: { display: "flex", flexDirection: "column" as const, gap: "20px" },
  section: { display: "flex", flexDirection: "column" as const, gap: "8px", flex: 1 },
  row: { display: "flex", gap: "16px" },
  label: { fontSize: "10px", fontWeight: 900, color: "#cbd5e1", textTransform: "uppercase" as const, letterSpacing: "1px" },
  input: { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", color: "#fff", fontSize: "13px", outline: "none" },
  agentInput: { backgroundColor: "rgba(255, 191, 0, 0.05)", border: "1px solid rgba(255, 191, 0, 0.3)", borderRadius: "8px", padding: "12px 16px", color: "#FFBF00", fontSize: "13px", fontWeight: "700", outline: "none", letterSpacing: "2px" },
  divider: { border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "10px 0" },
  button: { marginTop: "10px", backgroundColor: "#FFBF00", color: "#05292e", border: "none", borderRadius: "8px", padding: "16px", fontWeight: 900, fontSize: "12px", textTransform: "uppercase" as const, cursor: "pointer" },
};

