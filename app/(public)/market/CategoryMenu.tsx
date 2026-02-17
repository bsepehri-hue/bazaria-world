"use client";

import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { MARKET_CATEGORIES } from "@/app/lib/categories";

export default function CategoryMenu({ activeCategory }) {
  return (
    <div className="mb-8">
      {MARKET_CATEGORIES.map((cat) => (
        <Disclosure key={cat.id}>
          {({ open }) => (
            <div className="border rounded-lg mb-2">
              <Disclosure.Button className="w-full py-3 px-4 text-left font-medium text-gray-800">
                {cat.label}
              </Disclosure.Button>

              <Disclosure.Panel className="px-4 pb-3">
                {cat.subcategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/market?category=${cat.id}&sub=${sub.id}`}
                    className="block py-1 text-sm text-gray-600 hover:text-black"
                  >
                    {sub.label}
                  </Link>
                ))}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
