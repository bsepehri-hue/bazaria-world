import CategoryMenu from "./CategoryMenu";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto p-4 flex gap-6">
      
      {/* Left sidebar */}
      <div className="w-64 shrink-0">
        <CategoryMenu />
      </div>

      {/* Right content area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
