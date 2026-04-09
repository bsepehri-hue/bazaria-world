"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  PalmTree, 
  Home, 
  Map, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck 
} from "lucide-react";

const propertyTiers = [
  {
    id: "caribbean",
    title: "Caribbean Portfolio",
    description: "Elite Vacation Properties & International Estates.",
    icon: PalmTree,
    path: "/market/create/properties/caribbean",
    image: "https://images.unsplash.com/photo-1544984243-75ff602a5716?q=80&w=1000",
  },
  {
    id: "residential",
    title: "Residential Homes",
    description: "Standard Housing, Apartments, and Condos.",
    icon: Home,
    path: "/market/create/properties/residential",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
  },
  {
    id: "land",
    title: "Land & Soil",
    description: "Development Plots, Acreage, and Agricultural Land.",
    icon: Map,
    path: "/market/create/properties/land",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
  },
];

export default function PropertySubGateway() {
  const router = useRouter();

  return (
    /* 🛡️ THE STAGE: Fixed positioning to stay 100% white/off-white */
    <div style={{ 
      position: 'fixed',
      inset: 0,
      backgroundColor: '#f8f8f5',
      zIndex: 50,
      overflowY: 'auto',
      padding: '80px 40px',
      left: '240px', // Adjusted for sidebar
      top: '64px'    // Adjusted for nav
    }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Navigation */}
        <button 
          onClick={() => router.push("/market/create")} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', 
            background: 'none', border: 'none', cursor: 'pointer', marginBottom: '40px',
            fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em'
          }}
        >
          <ArrowLeft size={14} /> Back to Gateway
        </button>

        {/* Header Section */}
        <div style={{ marginBottom: '60px', borderLeft: '4px solid #06b6d4', paddingLeft: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '8px' }}>
            <ShieldCheck size={12} style={{ color: '#0891b2' }} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Asset Intake Protocol
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Property Portal
          </h1>
        </div>

        {/* 🎯 THE GRID: 3 Professional Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '32px',
          width: '100%'
        }}>
          {propertyTiers.map((tier) => (
            <button 
              key={tier.id} 
              onClick={() => router.push(tier.path)} 
              className="group"
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                minHeight: '520px',
                padding: '0',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                outline: 'none',
                position: 'relative'
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
              {/* 1. Card Header: Bazaria Teal */}
              <div style={{ backgroundColor: '#014d4e', padding: '40px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <tier.icon size={28} style={{ color: '#ffffff' }} />
                <h2 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0' }}>
                  {tier.title}
                </h2>
              </div>
              
              {/* 2. Card Body: Fading Image Layout */}
              <div style={{ backgroundColor: '#ffffff', flex: '1', display: 'flex', flexDirection: 'column', padding: '0', position: 'relative' }}>
                
                {/* Description Text */}
                <div style={{ padding: '30px 25px 10px', textAlign: 'center' }}>
                  <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic', margin: '0' }}>
                    "{tier.description}"
                  </p>
                </div>

                {/* The "Life & Color" Image */}
                <div style={{ flex: '1', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={tier.image} 
                    alt={tier.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: '0.9',
                      maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }} 
                  />
                </div>
                
                {/* 3. The Navigation Button */}
                <div style={{ padding: '0 0 30px', display: 'flex', justifyContent: 'center' }}>
                  <div className="group-hover:bg-slate-900 group-hover:border-slate-900" style={{ 
                    width: '52px', height: '52px', borderRadius: '50%', border: '1px solid #f1f5f9', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s',
                    backgroundColor: '#ffffff', position: 'relative', zIndex: 10
                  }}>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div style={{ marginTop: '80px', textAlign: 'center', opacity: '0.3' }}>
          <p style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5em', color: '#0f172a' }}>
            Bazaria Authority Protocol v1.02 // Secure Intake
          </p>
        </div>
      </div>
    </div>
  );
}
