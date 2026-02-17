"use client";

import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryMenu({ activeCategory }) {
  return (
    <div className="space-y-2">
      {MARKET_CATEGORIES.map((cat) => (
        <Disclosure key={cat.id}>
          {({ open }) => (
            <div className="border rounded-lg p-3">
              <Disclosure.Button className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  {cat.label}
                </span>

                <Disclosure.Button className="w-full text-left py-2 font-medium">
               {cat.label}

              </Disclosure.Button>

              <Disclosure.Panel className="mt-3 pl-7 space-y-2">
                {cat.subcategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/market?category=${cat.id}&sub=${sub.id}`}
                    className="block text-sm text-gray-700 hover:text-teal-600"
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
