import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      
      {/* Top navigation menu */}
      <CategoryMenu />

      {/* Main content */}
      <main className="mt-6">
        {children}
      </main>
    </div>
  );
}
