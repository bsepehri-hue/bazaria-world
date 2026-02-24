import CategoryButtons from "../components/CategoryButtons";

export default function MarketLayout({ children }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <CategoryButtons />
      {children}
    </div>
  );
}
