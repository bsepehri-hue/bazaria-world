import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function MarketplaceLayout({ children }) {
  return (
    <>
      <CategoryMenu />
      <div className="pt-[56px]">
        {children}
      </div>
    </>
  );
}
