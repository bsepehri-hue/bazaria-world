

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
     <div style={{ background: "red", height: "4px" }}></div>
      <main>{children}</main>
    </div>
  );
}
