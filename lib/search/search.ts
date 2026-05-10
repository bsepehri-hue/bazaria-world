import { shortenAddress } from "@/lib/utils";

// --- Type Definitions ---

export type SearchEntityType = 'Storefront' | 'Auction' | 'Category';

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
}

// --- Mock Data ---

const mockStorefronts: SearchResult[] = [
  { id: '1', type: 'Storefront', title: "Emily's Crafts", subtitle: `Owner: ${shortenAddress('0x1234E')}`, link: '/marketplace/1' },
  { id: '2', type: 'Storefront', title: "Jumper's Outfits", subtitle: `Owner: ${shortenAddress('0x5678J')}`, link: '/marketplace/2' },
  { id: '3', type: 'Storefront', title: "Ultimate Pens", subtitle: `Owner: ${shortenAddress('0x9012U')}`, link: '/marketplace/3' },
];

const mockAuctions: SearchResult[] = [
  { id: '101', type: 'Auction', title: "Rare Emerald Necklace", subtitle: 'Current Bid: 0.5 ETH', link: '/auctions/101' },
  { id: '102', type: 'Auction', title: "Limited Edition Jumper", subtitle: 'Current Bid: 1.5 ETH', link: '/auctions/102' },
  { id: '103', type: 'Auction', title: "Custom Leather Bag", subtitle: 'Ends in 48h', link: '/auctions/103' },
];

const mockCategories: SearchResult[] = [
  { id: 'cat_art', type: 'Category', title: "Digital Art & NFTs", subtitle: 'Browse 1,200 listings', link: '/marketplace?category=art' },
  { id: 'cat_wear', type: 'Category', title: "Wearables & Fashion", subtitle: 'Browse 450 listings', link: '/marketplace?category=wear' },
  { id: 'cat_craft', type: 'Category', title: "Handmade Crafts", subtitle: 'Browse 200 listings', link: '/marketplace?category=craft' },
];

export const mockAllSearchResults: SearchResult[] = [
  ...mockStorefronts,
  ...mockAuctions,
  ...mockCategories,
];
