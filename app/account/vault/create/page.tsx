"use client";

import React, { useState } from "react";
import { db, storage } from "@/lib/firebase/client"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Gem, MapPin, DollarSign, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function CreateAssetListing() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Property",
    description: "",
    price: "",
    location: "",
    coordinates: "",
    listingType: "Silent Event", // Auction vs Buy Now
  });

  const handlePublish = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "assets"), {
        ...formData,
        status: "Active",
        createdAt: serverTimestamp(),
        sellerId: "CURRENT_USER_ID", // We'll map this to auth
      });
      setStep(3); // Success Step
    } catch (err) {
      console.error("Listing Error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfcfc', padding: '60px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* 🏛️ STEP INDICATOR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '4px', flex: 1, backgroundColor: step >= i ? '#2dd4bf' : '#eee', borderRadius: '10px' }} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in">
            <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}>Asset Registry</h2>
            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>Identify the Sovereign Asset</p>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Asset Title</label>
              <input 
                style={inputStyle} 
                placeholder="e.g., Studio 64 Luxury Suite"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Category</label>
              <select 
                style={inputStyle}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Property</option>
                <option>Mobility</option>
                <option>Creative</option>
              </select>
            </div>

            <button onClick={() => setStep(2)} style={primaryBtn}>Continue to Logistics →</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in">
            <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}>Logistics & Value</h2>
            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>Define Market Parameters</p>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Location / Physical Address</label>
              <input 
                style={inputStyle} 
                placeholder="City, Country"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Initial Valuation (USD)</label>
              <input 
                style={inputStyle} 
                type="number" 
                placeholder="0.00"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <button onClick={() => setStep(1)} style={secondaryBtn}>Back</button>
              <button onClick={handlePublish} style={primaryBtn} disabled={loading}>
                {loading ? "COMMITTING TO REGISTRY..." : "PUBLISH TO MARKETPLACE"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }} className="animate-in zoom-in">
            <CheckCircle size={80} color="#2dd4bf" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}>Asset Live</h2>
            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>Sovereign Registry Updated Successfully</p>
            <button onClick={() => window.location.href = '/market'} style={primaryBtn}>View In Marketplace</button>
          </div>
        )}

      </div>
    </div>
  );
}

const inputGroup = { marginBottom: '24px' };
const labelStyle = { fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '2px', display: 'block', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #eee', fontSize: '14px', outline: 'none' };
const primaryBtn = { width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '18px', borderRadius: '14px', border: 'none', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '2px', cursor: 'pointer', marginTop: '20px' };
const secondaryBtn = { flex: 1, backgroundColor: 'transparent', border: '1px solid #eee', color: '#94a3b8', padding: '18px', borderRadius: '14px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '2px', cursor: 'pointer', marginTop: '20px' };
