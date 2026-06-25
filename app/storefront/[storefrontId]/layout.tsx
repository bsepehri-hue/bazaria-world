import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client"; 

// 🧠 1. DYNAMIC SEO GENERATOR (Runs purely on the server)
// FIX: We now define params as a Promise
export async function generateMetadata({ params }: { params: Promise<{ storefrontId: string }> }): Promise<Metadata> {
  // FIX: We await the params before extracting storefrontId
  const { storefrontId } = await params;
  
  // Default fallbacks
  let title = "Bazaria Storefront";
  let description = "Discover premium assets and curated inventory on Bazaria.";

  try {
    // 🚨 SAFETY CHECK: If db is undefined from the client import, we stop here to prevent a crash
    if (!db) {
      console.warn("Database connection unavailable on server. Using fallback SEO.");
      return { title, description };
    }

    let finalStoreData = null;
    
    // Check if the URL is a custom handle
    const handleIndexRef = doc(db, "handles", storefrontId.toLowerCase().trim());
    const handleIndexSnap = await getDoc(handleIndexRef);
    
    if (handleIndexSnap.exists()) {
      const finalUserId = handleIndexSnap.data().userId;
      const storeProfileRef = doc(db, "storefronts", finalUserId);
      const storeProfileSnap = await getDoc(storeProfileRef);
      if (storeProfileSnap.exists()) {
        finalStoreData = storeProfileSnap.data();
      }
    } else {
      // Fallback to direct ID check
      const directDocRef = doc(db, "storefronts", storefrontId);
      const directSnap = await getDoc(directDocRef);
      if (directSnap.exists()) {
        finalStoreData = directSnap.data();
      }
    }

    // Inject the merchant's specific data
    if (finalStoreData) {
      const displayName = finalStoreData.storeName || finalStoreData.name || storefrontId.replace(/-/g, ' ');
      title = `${displayName} | Premium Digital Storefront`;
      description = finalStoreData.description || `Shop high-quality assets and exclusive inventory from ${displayName} on Bazaria.`;
    }
  } catch (error) {
    console.error("SEO Generation Error:", error);
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      siteName: "Bazaria",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    }
  };
}

// 🖼️ 2. LAYOUT WRAPPER (Passes the UI to your page.tsx)
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
