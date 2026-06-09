// 📁 lib/search/search.ts
import { shortenAddress } from "@/lib/utils";
import { db } from "@/lib/firebase/client"; // Ensure this matches your path to initialized client db
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

// --- Type Definitions ---
export type SearchEntityType = 'Storefront' | 'Auction' | 'Category' | 'Listing';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  link: string;
}

export interface SectionedResults {
  Storefront: SearchResult[];
  Auction: SearchResult[];
  Category: SearchResult[];
  Listing: SearchResult[];
}

// --- Production Search Core Engine ---
export async function executeLiveSearch(searchTerm: string): Promise<SearchResult[]> {
  const cleanQuery = searchTerm.trim();
  if (!cleanQuery) return [];

  const results: SearchResult[] = [];

  // 🕵️ 1. DIRECT UID BYPASS CHECK
  // Alphanumeric strings typical of Firestore document IDs (20 characters)
  const isLikelyUID = /^[a-zA-Z0-9]{20,25}$/.test(cleanQuery);

  if (isLikelyUID) {
    try {
      // Direct point lookup against your live listings collection
      const docRef = doc(db, "listings", cleanQuery);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return [{
          id: docSnap.id,
          type: 'Listing',
          title: data.title || "Untitled Asset Listing",
          subtitle: `Direct Match | Cat: ${data.category || 'Unassigned'}`,
          link: `/market/asset/${docSnap.id}` // Pushes straight to your detail template
        }];
      }
    } catch (err) {
      console.error("Direct document ID database query error:", err);
    }
  }

  // 🔍 2. LIVE TEXT FALLBACK SCANNING
  // If it's not a direct ID, search through fields inside the collections
  try {
    const listingsRef = collection(db, "listings");
    
    // Simple substring fallback search matching title prefixes
    const textQuery = query(
      listingsRef,
      where("title", ">=", cleanQuery),
      where("title", "<=", cleanQuery + "\uf8ff"),
      limit(5)
    );
    
    const querySnapshot = await getDocs(textQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        type: 'Listing',
        title: data.title || "Untitled Asset",
        subtitle: data.category ? `Category: ${data.category}` : "Marketplace Asset",
        link: `/market/asset/${doc.id}`
      });
    });
  } catch (err) {
    console.error("Database collections text scan failed:", err);
  }

  // 🏷️ 3. STATIC MOCK CATEGORY MATCHES (Fallback for menu keywords)
  const normalized = cleanQuery.toLowerCase();
  if (normalized.includes("art") || normalized.includes("nft")) {
    results.push({ id: 'cat_art', type: 'Category', title: "Digital Art & NFTs", subtitle: 'Browse active items', link: '/market?category=art' });
  }
  if (normalized.includes("wear") || normalized.includes("clothing")) {
    results.push({ id: 'cat_wear', type: 'Category', title: "Wearables & Fashion", subtitle: 'Browse active items', link: '/market?category=wear' });
  }

  return results;
}

// --- Original Mock Exports (Maintained to protect dependent layouts from breaking) ---
const mockStorefronts: SearchResult[] = [
  { id: '1', type: 'Storefront', title: "Emily's Crafts", subtitle: `Owner: ${shortenAddress('0x1234E')}`, link: '/marketplace/1' },
];
const mockAuctions: SearchResult[] = [
  { id: '101', type: 'Auction', title: "Rare Emerald Necklace", subtitle: 'Current Bid: 0.5 ETH', link: '/auctions/101' },
];
const mockCategories: SearchResult[] = [
  { id: 'cat_art', type: 'Category', title: "Digital Art & NFTs", subtitle: 'Browse 1,200 listings', link: '/market?category=art' },
];
export const mockAllSearchResults: SearchResult[] = [...mockStorefronts, ...mockAuctions, ...mockCategories];
