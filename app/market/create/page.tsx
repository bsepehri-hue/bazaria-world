"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Home, 
  Car, 
  ArrowRight, 
  ShieldCheck, 
  Frame 
} from "lucide-react";

const sectors = [
  {
    id: "sanctuary",
    title: "Sanctuary Portfolio",
    description: "Elite Real Estate, Land, and Timeshares. Mandatory Audit Required.",
    icon: Home,
    path: "/market/create/properties", // Updated to go direct to Caribbean
    label: "Sovereign Asset",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
  },
  {
    id: "mobility",
    title: "Mobility & Logistics",
    description: "Cars, Trucks, Motorcycles, and Heavy Machinery Tracking.",
    icon: Car,
    path: "/market/create/mobility",
    label: "Market Utility",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000"
  },
  {
    id: "general",
    title: "General Marketplace",
    description: "Galerie Assets, Sovereign Art, Pedigreed Animals & Industrial Commodities",
    icon: Frame, 
    path: "/market/create/general",
    label: "Sovereign Sector // 03",
    image: "https://images.pexels.com/photos/69903/pexels-photo-69903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
  }
];

export default function MainEconomicIntake() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

 // ⚡ 1. THE REDIRECT LOGIC (Remove or Comment out to see the 3 cards)
/* useEffect(() => {
    if (editId) {
      router.replace(`/market/create/properties/caribbean?edit=${editId}`);
    }
  }, [editId, router]); 
  */

  // 🛡️ 2. THE LOADING STATE (COMMENT THIS OUT TOO!)
  /* if (editId) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#f8f8f5', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #014d4e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
            AUTHENTICATING ASSET AUTHORITY...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  } 
  */
  // 🎯 3. THE NORMAL VIEW (Only if NOT editing)
  return (
    <div style={{ 
      position: 'fixed', inset: 0, backgroundColor: '#f8f8f5', zIndex: 50, 
      overflowY: 'auto', padding: '80px 40px', left: '240px', top: '64px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '60px', borderLeft: '4px solid #014d4e', paddingLeft: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <ShieldCheck size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Economic Authority
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Economic <span style={{ color: '#014d4e' }}>Intake</span>
          </h1>
        </div>

        {/* The Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', width: '100%' }}>
          {sectors.map((s) => {
            const Icon = s.icon;
            return (
              <button 
                key={s.id} 
                onClick={() => router.push(s.path)} 
                className="group"
                style={{
                  display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden',
                  cursor: 'pointer', minHeight: '520px', transition: 'all 0.4s ease',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative'
                }}
              >
                <div style={{ backgroundColor: '#014d4e', padding: '40px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Icon size={28} style={{ color: '#ffffff' }} />
                  <h2 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{s.title}</h2>
                </div>
                
                <div style={{ backgroundColor: '#ffffff', flex: '1', display: 'flex', flexDirection: 'column', padding: '0', position: 'relative' }}>
                  <div style={{ padding: '30px 25px 10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#cbd5e1', display: 'block', marginBottom: '12px' }}>{s.label}</span>
                    <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic' }}>"{s.description}"</p>
                  </div>
                  <div style={{ flex: '1', position: 'relative', overflow: 'hidden' }}>
                    <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.9' }} />
                  </div>
                  <div style={{ padding: '0 0 30px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                      <ArrowRight size={20} className="text-slate-300" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
