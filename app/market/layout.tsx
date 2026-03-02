import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function MarketLayout({ children }) {
  return (
    <>
      <div style={{ background: "red", height: "4px" }}></div>

      {/* MENU MUST BE OUTSIDE THE CONTENT WRAPPER */}
      <CategoryMenu />

      {/* PAGE CONTENT WRAPPER */}
      <div className="max-w-6xl mx-auto p-4 mt-6">
        {children}
      </div>
    </>
  );
}
