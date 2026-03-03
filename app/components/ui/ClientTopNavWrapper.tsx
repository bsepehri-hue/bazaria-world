// NO "use client"
import ClientTopNav from "./ClientTopNav";

export default function ClientTopNavWrapper({ children }) {
  return (
    <div className="relative z-[9999]">
      <ClientTopNav />
      {children}
    </div>
  );
}
