import CategoryMenu from "./CategoryMenu";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <CategoryMenu />
      <main>{children}</main>
    </div>
  );
}
