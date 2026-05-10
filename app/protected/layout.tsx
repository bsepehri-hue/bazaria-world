// app/protected/layout.tsx
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ padding: "2rem" }}>
      <h2>Protected Section</h2>
      {children}
    </section>
  );
}
