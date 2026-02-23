export default function SubcategoryPage({ params }) {
  const { category, sub } = params;

  return (
    <div>
      <h1>{category} → {sub}</h1>
      {/* Firestore query goes here */}
    </div>
  );
}
