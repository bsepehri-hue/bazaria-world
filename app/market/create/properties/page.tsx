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
    /* 🛡️ THE TAKEOVER LAYER 
       We use 'fixed' to break out of the parent's green container entirely.
       We use left-[240px] and top-[64px] to stay perfectly inside your AppFrame UI.
    */
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-[#f8f8f5]"
      style={{ 
        left: 'var(--sidebar-width, 240px)', 
        top: 'var(--nav-height, 64px)',
        backgroundColor: '#f8f8f5'
      }}
    >
      <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-20">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push("/market/create")} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-black uppercase text-[10px] tracking-widest bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        {/* Header */}
        <div className="mb-12 border-l-4 border-cyan-500 pl-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2 font-black uppercase text-[9px] tracking-[0.3em]">
            <ShieldCheck size={12} className="text-cyan-600" />
            Asset Intake Protocol
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Property Portal
          </h1>
        </div>

        {/* The Grid - Now forced to be visible and white */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTiers.map((tier) => (
           <button 
  key={tier.id} 
  onClick={() => router.push(tier.path)} 
  className="group bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px]"
>
  {/* The Header - Sync to the Sidebar Teal */}
  <div className="bg-[#014d4e] p-6 flex flex-col items-center justify-center gap-2 text-white">
    <tier.icon size={24} />
    <h2 className="text-[12px] font-black uppercase tracking-widest">{tier.title}</h2>
  </div>
  
 {/* The Body - Force White */}
<div className="p-10 flex flex-col items-center justify-between flex-1 bg-white text-slate-500">
  <p className="text-[11px] font-bold leading-relaxed">{tier.description}</p>
  
  {/* 🎯 CHANGE THE LINE BELOW */}
  <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 transition-all">
    {/* 🎯 AND THE ICON COLOR BELOW */}
    <ChevronRight size={18} className="text-slate-200 group-hover:text-white" />
  </div>
</div>
</button>
          ))}
        </div>

        <div className="mt-32 text-center opacity-20 pb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-900">
            Bazaria Authority Protocol v1.02
          </p>
        </div>
      </div>
    </div>
  );
}
