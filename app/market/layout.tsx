import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function MarketLayout({ children }) {
  return (
   <div className="max-w-6xl mx-auto p-4 mt-20 flex flex-col">
      <div style={{ background: "red", height: "4px" }}></div>

      <CategoryMenu />

      <main className="mt-6">
        {children}
      </main>
    </div>
  );
}
