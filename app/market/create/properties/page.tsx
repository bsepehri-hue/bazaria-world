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
  /* 🛡️ VISIBILITY FIX: Remove 'fixed' and 'z-index'. Use standard flow. */
  <div className="w-full min-h-full bg-[#f8f8f5]">
    <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-20">
      
      {/* Header Section */}
      <button 
        onClick={() => router.push("/market/create")} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-12 font-black uppercase text-[10px] tracking-widest bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Gateway
      </button>

      <div className="mb-12 border-l-4 border-cyan-500 pl-6">
        <div className="flex items-center gap-2 text-slate-400 mb-2 font-black uppercase text-[9px] tracking-[0.3em]">
          <ShieldCheck size={12} className="text-cyan-600" />
          Asset Intake Protocol
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
          Property Portal
        </h1>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {propertyTiers.map((tier) => (
          <button 
            key={tier.id} 
            onClick={() => router.push(tier.path)} 
            /* 🛡️ GREEN FIX: Explicitly set background to white and remove 'group' */
            className="bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px]"
            style={{ backgroundColor: '#ffffff' }} 
          >
            {/* Header: Sync to Sidebar Teal */}
            <div style={{ backgroundColor: '#014d4e' }} className="p-6 flex flex-col items-center justify-center gap-2 text-white">
              <tier.icon size={24} />
              <h2 className="text-[12px] font-black uppercase tracking-widest">{tier.title}</h2>
            </div>
            
            {/* Body: Forced White to kill the Hulk rollover */}
            <div 
              style={{ backgroundColor: '#ffffff' }} 
              className="p-10 flex flex-col items-center justify-between flex-1 text-slate-500"
            >
              <p className="text-[11px] font-bold leading-relaxed">{tier.description}</p>
              
              {/* The Circle Icon: We use a simple hover effect that isn't green */}
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);
}
