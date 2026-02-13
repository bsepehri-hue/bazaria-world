import TopNav from "@/app/components/ui/TopNav";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopNav />
      <main>{children}</main>
    </div>
  );
}


