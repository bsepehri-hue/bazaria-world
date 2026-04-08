"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Car, Package, ArrowRight, ShieldCheck } from "lucide-react";

export default function EconomicIntakeGateway() {
  const router = useRouter();

  // 🛡️ THE NUCLEAR OVERRIDE: This hunts down the parent layout and forces the color change
  useEffect(() => {
    // We target the 'main' element and the 'body' to force the Bazaria Off-white
    const main = document.querySelector('main');
    const body = document.body;

    if (main) {
      main.style.setProperty('background-color', '#f8f8f5', 'important');
      main.style.setProperty('background', '#f8f8f5', 'important');
    }
    body.style.setProperty('background-color', '#f8f8f5', 'important');

    // 🧹 CLEANUP: Returns to green when you leave the 'Create' section
    return () => {
      if (main) {
        main.style.backgroundColor = '';
        main.style.background = '';
      }
      body.style.backgroundColor = '';
    };
  }, []);

  const sectors = [
    {
      id: "sanctuary",
      title: "Caribbean Sanctuary Portfolio",
      description: "Elite Real Estate, Land, and Timeshares. Mandatory Audit Required.",
      icon: Home,
      path: "/market/create/properties",
      label: "Sovereign Asset"
    },
    {
      id: "mobility",
      title: "Mobility & Logistics",
      description: "Cars, Trucks, Motorcycles, and Heavy Machinery Tracking.",
      icon: Car,
      path: "/market/create/mobility",
      label: "Market Utility"
    },
    {
      id: "general",
      title: "General Marketplace",
      description: "Art, Animals, Electronics, and other Living Economy assets.",
      icon: Package,
      path: "/market/create/general",
      label: "Market Utility"
    }
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-6">
      
      {/* 🛡️ HEADER SECTION */}
      <div className="mb-16">
        <div className="flex items-center gap-2 text-slate-400 mb-3">
          <ShieldCheck size={14} className="text-[#014d4e]" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol Authorization v1.02</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
          Economic <span className="text-[#014d4e]">Intake</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-4">
          Select Asset Deployment Sector for Marketplace Integration
        </p>
      </div>

      {/* 🏗️ PREMIUM HORIZONTAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            onClick={() => router.push(sector.path)}
            className="group bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px]"
          >
            {/* Header Bar - Bazaria Deep Green */}
            <div className="bg-[#014d4e] p-5 flex flex-col items-center justify-center gap-2">
              <sector.icon size={24} className="text-white" />
              <h2 className="text-[12px] font-black text-white uppercase tracking-widest">
                {sector.title}
              </h2>
            </div>
            
            {/* Card Body */}
            <div className="p-10 flex flex-col items-center justify-between flex-1">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                {sector.label}
              </span>
              
              <p className="text-[12px] font-bold text-slate-500 leading-relaxed max-w-[200px]">
                {sector.description}
              </p>
              
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-[#014d4e] group-hover:border-[#014d4e] transition-all duration-300">
                <ArrowRight size={18} className="text-slate-200 group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 🏎️ SYSTEM FOOTER */}
      <div className="mt-32 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-900">
          Bazaria Authority Protocol
        </p>
      </div>
    </div>
  );
}
