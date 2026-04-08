"use client";

import { useRouter } from "next/navigation";
import { Home, Map, ArrowLeft, ChevronRight, Trees } from "lucide-react";

export default function SanctuarySubGateway() {
  const router = useRouter();

  const propertyTiers = [
    {
      id: "caribbean",
      title: "Caribbean Portfolio 🌴",
      description: "Elite Vacation Properties & International Estates.",
      icon: Trees, 
      path: "/market/create/properties/hospitality",
      color: "bg-cyan-500",
      featured: true
    },
    {
      id: "homes",
      title: "Residential Homes",
      description: "Standard Housing, Apartments, and Condos.",
      icon: Home,
      path: "/market/create/properties/home",
      color: "bg-[#034241]",
      featured: false
    },
    {
      id: "land",
      title: "Land & Soil",
      description: "Development plots, Acreage, and Agricultural land.",
      icon: Map,
      path: "/market/create/properties/land",
      color: "bg-amber-700",
      featured: false
    }
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* 🛡️ THE IRONCLAD OVERRIDE: 
          This is a self-closing div that creates a 'new floor' for the app. 
          If the green is still there, it's physically impossible for it to show through this. */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: '#f8fafc', 
          zIndex: -1 
        }} 
      />

      {/* 🏗️ CONTENT LAYER */}
      <main className="relative z-10 p-8 md:p-16 flex flex-col items-center">
        <div className="w-full max-w-2xl text-left">
          
          <button 
            onClick={() => router.push("/market/create")} 
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-10 font-black uppercase text-[10px] tracking-widest border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft size={16} /> Main Gateway
          </button>

          <div className="mb-12 border-l-4 border-cyan-500 pl-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Property Portal
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Choose your deployment sector
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {propertyTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => router.push(tier.path)}
                className={`group flex items-center justify-between p-6 rounded-[2rem] bg-white border transition-all hover:shadow-xl cursor-pointer ${
                  tier.featured ? 'border-cyan-200 ring-4 ring-cyan-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`p-4 rounded-2xl ${tier.color} text-white shadow-lg shrink-0`}>
                    <tier.icon size={24} />
                  </div>
                  <div className="text-left">
                    <h2 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">
                      {tier.title}
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic tracking-tight">
                      {tier.description}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
