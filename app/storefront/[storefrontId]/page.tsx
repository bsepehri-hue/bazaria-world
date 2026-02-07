import Image from "next/image";
import { StorefrontBanner } from "@/components/storefront/StorefrontBanner/StorefrontBanner";
import { StorefrontListings } from "./StorefrontListings";
import { getStorefrontData } from "./getStorefrontData";

export default async function StorefrontPage({
  params,
}: {
  params: { storefrontId: string };
}) {
  const storefrontId = params.storefrontId;
  const data = await getStorefrontData(storefrontId);

  if (!data) {
    return (
      <div className="text-center text-gray-500 py-20">
        Storefront not found
      </div>
    );
  }

  const store = data.storefront;
  const listings = data.listings;

  return (
    <div className="pb-10 w-full flex flex-col">
      <StorefrontBanner storefrontId={storefrontId} />

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="flex items-center gap-4">
          {store.logoUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow">
              <Image
                src={store.logoUrl}
                alt="Store Logo"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">{store.name}</h1>
            {store.location && (
              <p className="text-gray-600 text-sm">{store.location}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-b mt-6">
        <div className="max-w-5xl mx-auto px-6 flex gap-6 text-sm font-medium text-gray-600">
          <a href="#shop" className="py-4 hover:text-black">Shop</a>
          <a href="#about" className="py-4 hover:text-black">About</a>
          <a href="#policies" className="py-4 hover:text-black">Policies</a>
          <a href="#reviews" className="py-4 hover:text-black">Reviews</a>
          <a href="#contact" className="py-4 hover:text-black">Contact</a>
        </div>
      </div>

      <section id="shop" className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">Shop</h2>

        <StorefrontListings listings={listings} />
      </section>

      <section id="about" className="max-w-5xl mx-auto px-6 py-10 border-t">
        <h2 className="text-2xl font-semibold mb-4">About</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {store.about || "This seller has not added an About section yet."}
        </p>
      </section>

      <section id="policies" className="max-w-5xl mx-auto px-6 py-10 border-t">
        <h2 className="text-2xl font-semibold mb-4">Policies</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium">Shipping Policy</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {store.shippingPolicy || "No shipping policy provided."}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Return Policy</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {store.returnPolicy || "No return policy provided."}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Terms</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {store.terms || "No terms provided."}
            </p>
          </div>
        </div>
      </section>

      <section id="reviews" className="max-w-5xl mx-auto px-6 py-10 border-t">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <p className="text-gray-500">Reviews are not available yet.</p>
      </section>

      <section id="contact" className="max-w-5xl mx-auto px-6 py-10 border-t mb-20">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="text-gray-700">
          {store.contactEmail
            ? `You can reach this seller at: ${store.contactEmail}`
            : "This seller has not provided contact information."}
        </p>
      </section>
    </div>
  );
}
