"use client";
import ClientTopNav from "@/app/components/ui/ClientTopNav";

export default function ClientTopNavWrapper({ children }) {
  return (
    <div className="fixed top-0 left-0 w-full z-[9999] bg-slate-950">
      <ClientTopNav />
      {children}
    </div>
  );
}
