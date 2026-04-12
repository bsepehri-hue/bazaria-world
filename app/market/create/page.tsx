"use client";

import React, { Suspense } from "react";
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
    path: "/market/create/properties",
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

function IntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f8f5',
      width: '100%'
    }}>
      <div style={{ 
        padding: '80px 40px', 
        marginLeft: '240px', 
        marginTop: '64px',
        maxWidth: '1200px'
      }}>
        
        {/* --- HEADER SECTION --- */}
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

        {/* --- THE GRID --- */}
       {/* --- THE GRID --- */}
<div style={{ 
  display: 'grid', 
  // 🎯 Use 1fr (fractional units) so they shrink/grow together
  // On large screens it shows 3, on smaller it will still fit 3 but thinner
  gridTemplateColumns: 'repeat(3, 1fr)', 
  gap: '24px', // Slightly smaller gap helps on half-screens
  width: '100%',
  // 🛡️ Added this to prevent the grid from ever pushing past the screen edge
  boxSizing: 'border-box'
}}>
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
                  cursor: 'pointer', minHeight: '520px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative',
                  outline: 'none', padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px)';
                  e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                }}
              >
                {/* 1. TOP SECTION: Sovereign Teal */}
                <div style={{ backgroundColor: '#014d4e', padding: '40px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Icon size={28} style={{ color: '#ffffff' }} />
                  <h2 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0' }}>
                    {s.title}
                  </h2>
                </div>
                
                {/* 2. CARD BODY */}
                <div style={{ backgroundColor: '#ffffff', flex: '1', display: 'flex', flexDirection: 'column', padding: '0', position: 'relative' }}>
                  <div style={{ padding: '30px 25px 10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#cbd5e1', display: 'block', marginBottom: '12px' }}>
                      {s.label}
                    </span>
                    <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                      "{s.description}"
                    </p>
                  </div>

                  <div style={{ flex: '1', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={s.image} 
                      alt={s.title} 
                      style={{ 
                        width: '100%', height: '100%', objectFit: 'cover', opacity: '0.9',
                        maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                      }} 
                    />
                  </div>

                  {/* 3. NAV CIRCLE */}
                  <div style={{ padding: '0 0 30px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ 
                        width: '52px', height: '52px', borderRadius: '50%', border: '1px solid #f1f5f9', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff',
                        transition: '0.3s'
                      }} 
                    >
                      <ArrowRight size={20} className="text-slate-300" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* --- FOOTER --- */}
        <div style={{ marginTop: '80px', textAlign: 'center', opacity: '0.4' }}>
          <p style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5em', color: '#0f172a' }}>
            Bazaria Authority Protocol v1.02 // Secure Intake
          </p>
        </div>
      </div>
    </div>
  );
}

// 🎯 MAIN EXPORT WRAPPED IN SUSPENSE
export default function MainEconomicIntake() {
  return (
    <Suspense fallback={null}>
      <IntakeContent />
    </Suspense>
  );
}
