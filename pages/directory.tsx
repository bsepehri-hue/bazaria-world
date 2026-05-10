import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Directory() {
  const [stewards, setStewards] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/directory')
      .then(res => res.json())
      .then(data => {
        setStewards(data);
        // Get unique categories
        const uniqueCategories = [...new Set(data.map(s => s.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl text-center mb-8">The Scroll of Merchants</h1>
      
      {categories.map(category => (
        <section key={category} className="mb-8">
          <h2 className="text-2xl font-serif border-b-2 border-amber-300 pb-2 mb-4">
            {category}
          </h2>
          <div className="space-y-4">
            {stewards.filter(s => s.category === category).map(steward => (
              <div key={steward.id} className="p-4 bg-white/50 rounded-lg shadow-sm">
                <Link href={`/store/${steward.id}`} className="font-bold text-xl hover:underline">
                  {steward.store_name}
                  {steward.is_verified && <span title="Verified Steward" className="ml-2">🧿</span>}
                </Link>
                <p className="text-gray-700 mt-1">{steward.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}