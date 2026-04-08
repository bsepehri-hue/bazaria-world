"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Car, Package, ArrowRight } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  // 🛡️ THE GLOBAL OVERRIDE
  useEffect(() => {
    // We create a temporary <style> tag to force the background to white
    const style = document.createElement('style');
    style.innerHTML = `
      /* We target every possible container that could be green */
      main, .bg-teal-900, [class*="bg-[#014d4e]"], section {
        background-color: #f8f8f5 !important;
        background: #f8f8f5 !important;
      }
      /* Ensure the body itself is clean */
      body { background-color: #f8f8f5 !important; }
    `;
    document.head.appendChild(style);

    // 🧹 CLEANUP: Remove the style when we leave so the marketplace turns green again
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    <div className="relative z-10 w-full min-h-screen">
      <main className="w-full max-w-7xl mx-auto pt-8">
        <div className="mb-12 text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Economic Intake
          </h1>
          <p className="text-slate-500 font-bold mt-3 uppercase text-[10px] tracking-[0.2em]">
            Select Asset Deployment Sector
          </p>
        </div>

        {/* 🏗️ THE V1.02 GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className="group bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden text-center cursor-pointer"
            >
              {/* Card Header - Hardcoded Green to survive the override */}
              <div className="bg-[#014d4e] p-4 flex flex-col items-center justify-center gap-1">
                <engine.icon size={20} className="text-white" />
                <h2 className="text-[11px] font-black text-white uppercase tracking-wider">
                  {engine.title}
                </h2>
              </div>
              
              <div className="p-8 flex flex-col items-center justify-center min-h-[180px]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">
                  {engine.label}
                </span>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed px-2">
                  {engine.description}
                </p>
                <div className="mt-8">
                  <ArrowRight size={18} className="text-[#014d4e] opacity-20 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-24 text-center pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            Bazaria Authority Protocol v1.02
          </p>
        </div>
      </main>
    </div>
  );
}
