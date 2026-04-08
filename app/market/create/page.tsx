"use client";

import { useRouter } from "next/navigation";
import { Home, Car, Package, ArrowRight, ShieldCheck } from "lucide-react";

export default function MainEconomicIntake() {
  const router = useRouter();

  const sectors = [
    {
      id: "sanctuary",
      title: "Sanctuary Portfolio",
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
    <div className="relative min-h-screen w-full !bg-[#f8f8f5]" style={{ backgroundColor: '#f8f8f5' }}>
      <main className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto">
        <div className="mb-16 border-l-4 border-[#014d4e] pl-6">
          <div className="flex items-center gap-2 text-[#014d4e] mb-2">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Economic Authority</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Economic <span className="text-[#014d4e]">Intake</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sectors.map((s) => (
            <button key={s.id} onClick={() => router.push(s.path)} className="group bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px]">
              <div className="bg-[#014d4e] p-6 flex flex-col items-center gap-2">
                <s.icon size={24} className="text-white" />
                <h2 className="text-[12px] font-black text-white uppercase tracking-widest">{s.title}</h2>
              </div>
              <div className="p-10 flex flex-col items-center justify-between flex-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">{s.label}</span>
                <p className="text-[12px] font-bold text-slate-500 leading-relaxed">{s.description}</p>
                <ArrowRight size={20} className="text-slate-200 group-hover:text-[#014d4e] transition-all" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
