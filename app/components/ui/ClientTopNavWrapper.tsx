// NO "use client"
import ClientTopNav from "@/app/components/ui/ClientTopNav";

export default function ClientTopNavWrapper({ children }) {
  return (
    <div className="relative z-[9999]">
      <ClientTopNav />
      {children}
    </div>
  );
}
