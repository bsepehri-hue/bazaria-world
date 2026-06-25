import { MetadataRoute } from "next";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bazaria.world"; // Replace with your production domain when live

  // 1️⃣ Static Core Pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/market`, lastModified: new Date() },
    { url: `${baseUrl}/market/directory`, lastModified: new Date() }, // Your storefront hub!
    { url: `${baseUrl}/checkout`, lastModified: new Date() },
  ];

  let storefrontUrls: { url: string; lastModified: Date }[] = [];
  let assetUrls: { url: string; lastModified: Date }[] = [];

  try {
    if (db) {
      // 2️⃣ Dynamic Storefront Pages (Using custom handles if available, otherwise fallback to ID)
      const storefrontsSnap = await getDocs(query(collection(db, "storefronts"), limit(100)));
      storefrontUrls = storefrontsSnap.docs.map((docSnap) => {
        const data = docSnap.data();
        // Use custom slug/handle if your DB stores it, otherwise use the doc ID
        const slug = data.handle || data.slug || docSnap.id;
        return {
          url: `${baseUrl}/storefront/${slug}`,
          lastModified: new Date(),
        };
      });

      // 3️⃣ Dynamic Asset Pages (Mapping to your app/market/asset/[id] architecture)
      const listingsSnap = await getDocs(query(collection(db, "listings"), limit(500)));
      assetUrls = listingsSnap.docs.map((docSnap) => {
        return {
          url: `${baseUrl}/market/asset/${docSnap.id}`,
          lastModified: new Date(),
        };
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  // Combine everything into one master index for Google
  return [...staticPages, ...storefrontUrls, ...assetUrls];
}
