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
      /* 🛡️ THE EXECUTIVE OVERRIDE
         This ensures THAT specific button class stays white 
         even when the global CSS tries to force Teal.
      */
      .portal-card-btn {
        background-color: #ffffff !important;
        appearance: none !important;
        border: 1px solid #e2e8f0 !important;
      }

      .portal-card-btn:hover {
        background-color: #ffffff !important;
        /* We only change the shadow and position, never the color */
        transform: translateY(-4px);
      }
    `}} />

    <div className="w-full min-h-full bg-[#f8f8f5]">
      <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTiers.map((tier) => (
            <button 
              key={tier.id} 
              onClick={() => router.push(tier.path)} 
              /* 🎯 We use a unique class to isolate it from global button styles */
              className="portal-card-btn group flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px] shadow-sm hover:shadow-xl transition-all"
            >
              {/* Header: This stays Teal to match the Sidebar */}
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-white bg-[#014d4e]">
                <tier.icon size={24} />
                <h2 className="text-[12px] font-black uppercase tracking-widest">{tier.title}</h2>
              </div>
              
              {/* Body: Forced White */}
              <div className="p-10 flex flex-col items-center justify-between flex-1 bg-white text-slate-500">
                <p className="text-[11px] font-bold leading-relaxed">{tier.description}</p>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ChevronRight size={18} className="text-slate-300" />
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
