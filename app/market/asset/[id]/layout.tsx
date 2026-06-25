import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client"; 

// 🧠 DYNAMIC ASSET SEO GENERATOR (Runs purely on the server)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Default fallbacks in case the item was deleted or is still loading
  let title = "Premium Asset | Bazaria";
  let description = "Discover authenticated real-world assets and exclusive inventory on Bazaria.";
  let imageUrl = ""; 

  try {
    // 🚨 SAFETY CHECK: Prevent server crashes if db fails to initialize
    if (!db) {
      return { title, description };
    }

    // 🔥 NOTE: Make sure "listings" matches your actual Firebase collection name for items!
    const assetRef = doc(db, "listings", id); 
    const assetSnap = await getDoc(assetRef);
    
    if (assetSnap.exists()) {
      const data = assetSnap.data();
      
      // Try to find the price based on your database structure
      const price = data.buyNowPrice || data.price || data.currentBid || "";
      const formattedPrice = price ? ` - $${Number(price).toLocaleString()}` : "";
      
      // Build the perfect Google Title: "1920s Rolex - $5,000 | Bazaria"
      title = `${data.title || data.name || "Premium Asset"}${formattedPrice} | Bazaria`;
      
      // Build the description and grab the hero image for link previews
      description = data.description ? data.description.substring(0, 160) + "..." : description;
      imageUrl = data.images?.[0] || data.imageUrl || data.image || "";
    }
  } catch (error) {
    console.error("Asset SEO Generation Error:", error);
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
      type: "website",
      siteName: "Bazaria",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

// 🖼️ LAYOUT WRAPPER (Passes the UI down to your client page)
export default function AssetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
