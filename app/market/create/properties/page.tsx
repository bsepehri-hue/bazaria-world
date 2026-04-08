"use client";

import { useRouter } from "next/navigation";
import { Home, Car, Package, ArrowRight } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
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
    <div className="relative min-h-screen w-full bg-[#f8fafc] overflow-x-hidden">
      {/* 🛡️ THE GREEN KILLER: A fixed layer to hide the layout's green padding */}
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: '#f8fafc', 
          zIndex: 0 
        }} 
      />

      <main className="relative z-10 p-8 md:p-12 w-full max-w-7xl mx-auto">
        <div className="mb-12 text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Economic Intake
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Select Asset Deployment Sector
          </p>
        </div>

        {/* 🏗️ PROTOCOL GRID (Matches your CC12A5 Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className="group bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden text-center cursor-pointer"
            >
              {/* Header Bar: Bazaria Deep Green */}
              <div className="bg-[#034241] p-3 flex flex-col items-center justify-center gap-1">
                <engine.icon size={20} className="text-white" />
                <h2 className="text-[11px] font-bold text-white uppercase tracking-wider">
                  {engine.title}
                </h2>
              </div>
              
              {/* Card Body */}
              <div className="p-8 flex flex-col items-center justify-center min-h-[160px]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2 block">
                  {engine.label}
                </span>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed px-4">
                  {engine.description}
                </p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-[#034241]" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Protocol Footer */}
        <div className="mt-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Bazaria Authority Protocol v1.02
          </p>
        </div>
      </main>
    </div>
  );
}
