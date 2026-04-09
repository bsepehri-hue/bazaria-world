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
      /* 🛡️ THE GHOST KILLER */
      .intake-card {
        background-color: #ffffff !important;
        cursor: pointer;
        transition: all 0.3s ease-important;
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* 🛡️ FORCE THE HOVER TO STAY WHITE */
      .intake-card:hover {
        background-color: #ffffff !important;
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
      }

      /* 🛡️ KILL THE 'BLANK PAGE' GHOST */
      main, .page-content {
        background-color: #f8f8f5 !important;
        opacity: 1 !important;
        display: flex !important;
      }
    `}} />

    <div className="w-full min-h-screen bg-[#f8f8f5]">
      <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTiers.map((tier) => (
            /* 🎯 CHANGED FROM <button> TO <div> TO KILL GLOBAL CSS */
            <div 
              key={tier.id} 
              onClick={() => router.push(tier.path)} 
              className="intake-card border border-slate-200 flex flex-col overflow-hidden text-center min-h-[400px]"
            >
              {/* Header */}
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-white bg-[#014d4e]">
                <tier.icon size={24} />
                <h2 className="text-[12px] font-black uppercase tracking-widest m-0">{tier.title}</h2>
              </div>
              
              {/* Body */}
              <div className="p-10 flex flex-col items-center justify-between flex-1 text-slate-500 bg-white">
                <p className="text-[11px] font-bold leading-relaxed">{tier.description}</p>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
}
