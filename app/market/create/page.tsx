"use client";

import { useRouter } from "next/navigation";
import { Home, Car, ShieldCheck, ChevronRight, Package, Sparkles } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
    {
      id: "sanctuary",
      title: "Caribbean Sanctuary Portfolio",
      description: "Elite Real Estate, Land, Rooms, and Timeshares. Mandatory Sanctuary Audit Required.",
      icon: Home,
      path: "/listings/properties/new",
      isElite: true,
    },
    {
      id: "mobility",
      title: "Mobility & Logistics",
      description: "Cars, Trucks, Motorcycles, RVs, and Heavy Machinery. Includes Fleet & Logistics tracking.",
      icon: Car,
      path: "/market/create/mobility",
      isElite: false,
    },
    {
      id: "general",
      title: "General Marketplace",
      description: "Art, Animals, Electronics, Services, and other Living Economy goods.",
      icon: Package,
      path: "/market/create/general",
      isElite: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Create Listing</h1>
          <p className="text-slate-500 font-medium italic">Select your sector within the Bazaria Economy.</p>
        </div>

        {/* Selection Stack */}
        <div className="flex flex-col gap-5">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className={`group w-full relative overflow-hidden text-left p-6 rounded-3xl border-2 transition-all hover:scale-[1.01] shadow-sm flex items-center justify-between ${
                engine.isElite 
                  ? "bg-[#034241] border-teal-400 text-white" 
                  : "bg-white border-slate-200 text-slate-900 hover:border-teal-600/30"
              }`}
            >
              <div className="flex items-center gap-5 relative z-10">
                {/* Icon Container */}
                <div className={`p-4 rounded-2xl shrink-0 ${engine.isElite ? 'bg-teal-400/20' : 'bg-slate-100'}`}>
                  <engine.icon className={engine.isElite ? 'text-teal-400' : 'text-teal-700'} size={28} />
                </div>

                {/* Text Content */}
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black uppercase tracking-tight leading-none">
                      {engine.title}
                    </h2>
                    {engine.isElite && <ShieldCheck size={16} className="text-teal-400" />}
                  </div>
                  <p className={`text-xs mt-2 font-medium leading-relaxed opacity-80 ${engine.isElite ? 'text-teal-100' : 'text-slate-500'}`}>
                    {engine.description}
                  </p>
                </div>
              </div>
              
              {/* Arrow Indicator */}
              <div className={`shrink-0 transition-transform group-hover:translate-x-1 ${engine.isElite ? 'text-teal-400' : 'text-slate-300'}`}>
                <ChevronRight size={24} />
              </div>

              {/* Decorative Background Glow for Elite Option */}
              {engine.isElite && (
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                  <Sparkles size={100} className="text-teal-400" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer Authority Stamp */}
        <div className="pt-6 border-t border-slate-200 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Bazaria Authority Protocol v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
