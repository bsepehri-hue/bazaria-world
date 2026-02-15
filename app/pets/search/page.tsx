"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function PetsSearchPage() {
  const [allPets, setAllPets] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sex, setSex] = useState("");
  const [breed, setBreed] = useState("");
const [age, setAge] = useState("");
const [vaccinated, setVaccinated] = useState("");
const [temperament, setTemperament] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      const petsQuery = query(
        collection(db, "listings"),
        where("category", "==", "pets")
      );

      const snap = await getDocs(petsQuery);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setAllPets(items);
      setFiltered(items);
      setLoading(false);
    };

    fetchPets();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = allPets;

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(q)
      );
    }

    if (type) {
      results = results.filter((item) => item.petType === type);
    }

    if (sex) {
      results = results.filter((item) => item.sex === sex);
    }

    if (breed) {
  results = results.filter((item) =>
    item.breed?.toLowerCase().includes(breed.toLowerCase())
  );
}

if (age) {
  results = results.filter((item) => item.age === age);
}

if (vaccinated) {
  results = results.filter((item) => item.vaccinated === vaccinated);
}

if (temperament) {
  results = results.filter((item) =>
    item.temperament?.includes(temperament)
  );
}

    setFiltered(results);
  }, [search, type, sex, allPets]);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ⭐ Header */}
      <h1 className="text-3xl font-bold mb-6">Search Pets</h1>

      {/* ⭐ Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search pets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg"
        />

        {/* Pet Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="">All Types</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="bird">Birds</option>
          <option value="reptile">Reptiles</option>
          <option value="small">Small Pets</option>
        </select>

        {/* Sex */}
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="">Any Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* ⭐ Results */}
      {loading && <div>Loading pets...</div>}

      {!loading && filtered.length === 0 && (
        <p>No pets found. Try adjusting your filters.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/pets/${item.id}`}
              className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 block"
            >
              <div className="font-semibold">{item.title}</div>

              {item.price && (
                <div className="text-sm text-gray-600">
                  ${item.price.toLocaleString()}
                </div>
              )}

              <div className="text-xs text-gray-500 mt-1 capitalize">
                {item.petType || "Pet"} • {item.sex || "—"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
