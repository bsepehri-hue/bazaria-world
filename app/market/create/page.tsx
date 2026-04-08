"use client";

import { useRouter } from "next/navigation";
import { Home, Car, Package, ShieldCheck, ChevronRight } from "lucide-react";

export default function EconomicIntakeGateway() {
  const router = useRouter();

  const sectors = [
    {
      id: "sanctuary",
      title: "Sanctuary Portfolio",
      sub: "Real Estate & Estates",
      description: "Sovereign property deployment, land acquisition, and hospitality assets.",
      icon: Home,
      path: "/market/create/properties",
      accent: "border-cyan-400"
    },
    {
      id: "mobility",
      title: "Mobility & Logistics",
      sub: "Fleet & Heavy Machinery",
      description: "Registered vehicle assets, logistics tracking, and industrial machinery.",
      icon: Car,
      path: "/market/create/mobility",
      accent: "border-amber-400"
    },
    {
      id: "general",
      title: "General Marketplace",
      sub: "Standard Asset Entry",
      description: "Art, technology, electronics, and miscellaneous economic assets.",
      icon: Package,
      path: "/market/create/general",
      accent: "border-emerald-400"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      {/* 🛡️ HEADER SECTION */}
      <div className="mb-16 border-l-2 border-white/20 pl-8">
        <div className="flex items-center gap-3 text-white/50 mb-4">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Authorization Active</span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
          Economic <span className="text-white/40 italic">Intake</span>
        </h1>
        <p className="text-white/60 font-bold uppercase text-[11px] tracking-widest">
          Sector Selection for Asset Deployment
        </p>
      </div>

      {/* 🏗️ GLASSMOPHISM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            onClick={() => router.push(sector.path)}
            className={`group relative bg-white/5 hover:bg-white/10 border-t-4 ${sector.accent} border-x border-b border-white/10 p-8 text-left transition-all duration-300 backdrop-blur-sm cursor-pointer min-h-[320px] flex flex-col justify-between`}
          >
            <div>
              <div className="mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                <sector.icon size={32} className="text-white" />
              </div>
              
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                {sector.sub}
              </h3>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-4">
                {sector.title}
              </h2>
              <p className="text-white/40 text-[11px] font-bold leading-relaxed uppercase tracking-wide">
                {sector.description}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between text-white/20 group-hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">Enter Portal</span>
              <ChevronRight size={20} className="transform group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* 🏎️ SYSTEM FOOTER */}
      <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white">
          Bazaria Authority Protocol v1.02
        </p>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white mt-4 md:mt-0">
          Terminal Status: <span className="text-emerald-400">Encrypted</span>
        </p>
      </div>
    </div>
  );
}
