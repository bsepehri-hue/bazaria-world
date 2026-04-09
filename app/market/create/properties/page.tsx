"use client";

import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

export default function PropertySubGateway() {
  const router = useRouter();

  const propertyTiers = [
    {
      id: "caribbean",
      title: "Caribbean Portfolio",
      description: "Elite Vacation Properties & International Estates.",
      icon: Trees, 
      path: "/market/create/properties/hospitality",
      accent: "bg-cyan-600"
    },
    {
      id: "homes",
      title: "Residential Homes",
      description: "Standard Housing, Apartments, and Condos.",
      icon: Home,
      path: "/market/create/properties/home",
      accent: "bg-[#014d4e]"
    },
    {
      id: "land",
      title: "Land & Soil",
      description: "Development plots, Acreage, and Agricultural land.",
      icon: Map,
      path: "/market/create/properties/land",
      accent: "bg-amber-700"
    }
  ];

return (
  /* 🛡️ THE CANVAS: Forces the background to be off-white and centers everything */
  <div style={{ 
    backgroundColor: '#f8f8f5', 
    minHeight: '100vh', 
    width: '100%', 
    display: 'flex', 
    justifyContent: 'center',
    padding: '80px 20px' 
  }}>
    
    {/* 🛡️ THE CONSTRAINER: Limits the width so cards don't stretch edge-to-edge */}
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: '60px', borderLeft: '4px solid #06b6d4', paddingLeft: '24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Property Portal
        </h1>
        <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '8px' }}>
          Asset Intake Protocol
        </p>
      </div>

      {/* 🎯 THE GRID: Forced to 3 columns side-by-side */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '40px'
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
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: '480px',
              padding: '0',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
          >
            {/* 1. Header (Bazaria Teal) */}
            <div style={{ backgroundColor: '#014d4e', padding: '50px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <tier.icon size={32} style={{ color: '#ffffff' }} />
              <h2 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0' }}>
                {tier.title}
              </h2>
            </div>
            
            {/* 2. Body (Pure White) */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7', fontStyle: 'italic', margin: '0', textAlign: 'center' }}>
                "{tier.description}"
              </p>
              
              {/* 3. The Arrow Circle */}
              <div className="group-hover:bg-slate-900 group-hover:border-slate-900" style={{ 
                width: '56px', height: '56px', borderRadius: '50%', border: '1px solid #f1f5f9', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' 
              }}>
                <ChevronRight size={22} className="text-slate-300 group-hover:text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);
}
