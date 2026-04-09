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
  /* 🛡️ THE STAGE: We use 'fixed' to ignore the parent's layout entirely */
  <div style={{ 
    position: 'fixed',
    inset: 0,
    backgroundColor: '#f8f8f5',
    zIndex: 50,
    overflowY: 'auto',
    padding: '60px 20px',
    left: '240px', // Matches your sidebar width
    top: '64px'    // Matches your nav height
  }}>
    
    {/* 🛡️ CENTERED BOX: Limits the grid width */}
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '50px', borderLeft: '5px solid #06b6d4', paddingLeft: '20px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase' }}>
          Property Portal
        </h1>
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
          Asset Intake Protocol
        </p>
      </div>

      {/* 🎯 THE GRID: Forced 3 columns with absolute units to prevent stretching */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'nowrap', // Forces them to stay in one row
        gap: '30px',
        width: '100%',
        justifyContent: 'space-between'
      }}>
        {propertyTiers.map((tier) => (
          <button 
            key={tier.id} 
            onClick={() => router.push(tier.path)} 
            className="group"
            style={{
              flex: '1',
              minWidth: '300px',
              maxWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: '480px',
              padding: '0',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              outline: 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 30px 40px -10px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
            }}
          >
            {/* Header (Teal) */}
            <div style={{ backgroundColor: '#014d4e', padding: '40px 10px', width: '100%' }}>
              <tier.icon size={28} style={{ color: '#ffffff', marginBottom: '10px' }} />
              <h2 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0' }}>
                {tier.title}
              </h2>
            </div>
            
            {/* Body (White) */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px 25px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.8', fontStyle: 'italic', margin: '0' }}>
                "{tier.description}"
              </p>
              
              <div className="group-hover:bg-slate-900" style={{ 
                width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #f1f5f9', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' 
              }}>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);
}
