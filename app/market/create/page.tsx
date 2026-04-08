"use client";

import { useRouter } from "next/navigation";
import { Home, Car, ShieldCheck, ChevronRight, Package } from "lucide-react";

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
      description: "Cars, Trucks, Motorcycles, RVs, and Heavy Machinery. Includes Fleet tracking.",
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
    <div className="flex flex-col items-center justify-start p-6 md:p-12 w-full min-h-full">
      <div className="w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900" style={{ color: '#0f172a' }}>
            Create New Listing
          </h1>
          <p className="text-slate-500 text-sm font-medium italic">
            Select the sector for your new asset.
          </p>
        </div>

        {/* Vertical Selection Stack */}
        <div className="flex flex-col gap-4">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className="group w-full flex items-center justify-between p-6 rounded-3xl border border-slate-100 transition-all hover:border-teal-500 hover:shadow-md"
              style={{ backgroundColor: 'white', display: 'flex', textAlign: 'left' }}
            >
              <div className="flex items-center gap-5">
                {/* Icon Circle */}
                <div className={`p-4 rounded-2xl shrink-0 ${engine.isElite ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-600'}`}>
                  <engine.icon size={28} />
                </div>

                {/* Text Content */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none" style={{ color: '#0f172a' }}>
                      {engine.title}
                    </span>
                    {engine.isElite && <ShieldCheck size={18} className="text-teal-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed max-w-xs">
                    {engine.description}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight 
                size={22} 
                className="text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-1 shrink-0" 
              />
            </button>
          ))}
        </div>

        {/* Footer Authority Stamp */}
        <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Bazaria Authority Protocol v1.0
          </p>
          <div className="h-1 w-8 bg-teal-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
