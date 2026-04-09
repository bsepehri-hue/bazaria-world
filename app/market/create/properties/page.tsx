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
  <>
    <style dangerouslySetInnerHTML={{ __html: `
      /* 🛡️ LOCK THE COLOR, ALLOW THE MOVEMENT */
      .portal-card-btn {
        background-color: #ffffff !important;
        transition: transform 0.25s ease, box-shadow 0.25s ease !important;
        border: 1px solid #e2e8f0 !important;
        display: flex !important;
      }

      /* This is where we add the "life" back to the card */
      .portal-card-btn:hover {
        background-color: #ffffff !important;
        transform: translateY(-8px) !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        border-color: #cbd5e1 !important;
      }

      /* Ensure the inner body stays white on hover too */
      .portal-card-btn:hover .card-body-white {
        background-color: #ffffff !important;
      }
    `}} />

    <div className="w-full min-h-full bg-[#f8f8f5]">
      <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {propertyTiers.map((tier) => (
  <button 
    key={tier.id} 
    onClick={() => router.push(tier.path)} 
    className="group" /* We keep 'group' only for the small arrow hover */
    style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff', // 🛡️ FORCE WHITE
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      minHeight: '400px',
      padding: '0',
      transition: 'all 0.3s ease',
      width: '100%',
      outline: 'none',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}
    /* Manually adding the hover 'Lift' back via JS */
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
  >
    {/* 1. THE HEADER (Teal) */}
    <div style={{
      backgroundColor: '#014d4e',
      padding: '32px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      <tier.icon size={28} style={{ color: '#ffffff' }} />
      <h2 style={{
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        margin: '0'
      }}>
        {tier.title}
      </h2>
    </div>
    
    {/* 2. THE BODY (White) */}
    <div style={{
      backgroundColor: '#ffffff',
      padding: '40px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      <p style={{
        color: '#475569', // Slate-600
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '1.6',
        fontStyle: 'italic',
        margin: '0'
      }}>
        {tier.description}
      </p>
      
      {/* 3. THE INTERACTION CIRCLE */}
      <div className="group-hover:bg-slate-900 group-hover:border-slate-900" style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}>
        <ChevronRight size={20} className="text-slate-300 group-hover:text-white" />
      </div>
    </div>
  </button>
))}
        </div>
      </div>
    </div>
  </>
);
}
