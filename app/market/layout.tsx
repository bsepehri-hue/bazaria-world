import CategoryMenu from "@/app/components/GlobalCategoryMenu";

export default function MarketLayout({ children }) {
  return (
    <>
      <div style={{ background: "red", height: "4px" }}></div>

      {/* REMOVE CategoryMenu from here */}

      <div className="max-w-6xl mx-auto p-4 mt-6">
        {children}
      </div>
    </>
  );
}
