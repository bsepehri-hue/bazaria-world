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
    /* 🛡️ Animation is working! We keep these classes */
    className="group relative flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px] rounded-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl active:scale-95 bg-white border border-slate-200"
    style={{ backgroundColor: '#ffffff' }}
  >
    {/* 1. The Header: Forced Teal */}
    <div 
      style={{ backgroundColor: '#014d4e' }} 
      className="p-8 flex flex-col items-center justify-center gap-3 relative"
    >
      {/* 🎯 FORCE CONTENT TO FRONT */}
      <div className="relative z-20 flex flex-col items-center gap-3">
        <tier.icon size={28} className="text-white" />
        <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-white m-0">
          {tier.title}
        </h2>
      </div>
    </div>
    
    {/* 2. The Body: Forced White */}
    <div 
      style={{ backgroundColor: '#ffffff' }} 
      className="p-10 flex flex-col items-center justify-between flex-1 relative"
    >
      {/* 🎯 FORCE CONTENT TO FRONT */}
      <div className="relative z-20 w-full flex flex-col items-center gap-6">
        <p className="text-[12px] font-medium leading-relaxed italic text-slate-600">
          {tier.description}
        </p>
      </div>

      {/* 3. The Interaction Circle */}
      <div className="relative z-20 w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-900 group-hover:border-slate-900">
        <ChevronRight 
          size={20} 
          className="text-slate-400 group-hover:text-white" 
        />
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
