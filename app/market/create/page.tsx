"use client";

import { useRouter } from "next/navigation";
import { Home, Car, ShieldCheck, ChevronRight, Package, ArrowRight } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
    {
      id: "sanctuary",
      title: "Caribbean Sanctuary Portfolio",
      description: "Elite Real Estate, Land, Rooms, and Timeshares. Mandatory Audit Required.",
      icon: Home,
      path: "/listings/properties/new",
      isElite: true,
      accent: "from-teal-600 to-[#034241]",
    },
    {
      id: "mobility",
      title: "Mobility & Logistics",
      description: "Cars, Trucks, Motorcycles, RVs, and Heavy Machinery Tracking.",
      icon: Car,
      path: "/market/create/mobility",
      isElite: false,
      accent: "from-slate-700 to-slate-900",
    },
    {
      id: "general",
      title: "General Marketplace",
      description: "Art, Animals, Electronics, and other Living Economy assets.",
      icon: Package,
      path: "/market/create/general",
      isElite: false,
      accent: "from-slate-700 to-slate-900",
    },
  ];

  return (
    <div className="p-8 md:p-16 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter text-[#034241]">
          Economic Intake
        </h1>
        <div className="h-2 w-24 bg-teal-500 mt-2 mb-4 rounded-full" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Select Sector for Asset Deployment
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {engines.map((engine) => (
          <button
            key={engine.id}
            onClick={() => router.push(engine.path)}
            className={`group relative overflow-hidden rounded-[2rem] border-0 p-1 transition-all hover:scale-[1.01] hover:shadow-2xl active:scale-95`}
          >
            {/* The Gradient Background Layer */}
            <div className={`absolute inset-0 bg-gradient-to-r ${engine.accent} opacity-100 transition-opacity`} />

            <div className="relative flex items-center justify-between bg-black/10 backdrop-blur-sm p-8 text-white">
              <div className="flex items-center gap-8">
                {/* Modern Icon Frame */}
                <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                  <engine.icon size={32} className={engine.isElite ? "text-teal-300" : "text-white"} />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                      {engine.title}
                    </h2>
                    {engine.isElite && (
                      <span className="bg-teal-400 text-[#034241] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Elite
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white/60 mt-1 max-w-md">
                    {engine.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Engine
                </span>
                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 flex items-center justify-center gap-4">
        <span className="h-[1px] w-12 bg-slate-200" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Bazaria Authority Protocol v1.02
        </p>
        <span className="h-[1px] w-12 bg-slate-200" />
      </div>
    </div>
  );
}
