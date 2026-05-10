
// --- Data Interfaces ---
export interface StorefrontData {
  id: bigint;
  owner: string;
  name: string;
  profileDataUri: string;
  totalListings: bigint;
}

export interface AuctionData {
  auctionId: bigint;
  storefrontId: bigint;
  seller: string;
  listingName: string;
  itemUri: string;
  currentBid: bigint;
  highestBidder: string;
  endTime: bigint;
}

// --- Storefront Fetcher (Mock / Firestore placeholder) ---
export async function fetchAllStorefronts(): Promise<StorefrontData[]> {
  return [
    {
      id: BigInt(1),
      owner: "0x1234...ABCD",
      name: "Emily's Crafts",
      profileDataUri: "https://placehold.co/400x200/2ecc71/white?text=EMILY",
      totalListings: BigInt(15),
    },
    {
      id: BigInt(2),
      owner: "0x5678...EFGH",
      name: "Jumper's Outfits",
      profileDataUri: "https://placehold.co/400x200/3498db/white?text=JUMPER",
      totalListings: BigInt(22),
    },
  ];
}

// --- Auction Fetchers (Mock for now) ---
export async function fetchAuctionById(auctionId: string): Promise<AuctionData> {
  const idBigInt = BigInt(auctionId);
  const nowInSeconds = BigInt(Math.floor(Date.now() / 1000));

  return {
    auctionId: idBigInt,
    storefrontId: BigInt(1),
    seller: "0x1234...ABCD",
    listingName: `Dynamic Auction #${auctionId}: Rare Ancient Scroll`,
    itemUri:
      "https://placehold.co/800x600/024c05/white?text=Ancient+Scroll+Listing",
    currentBid: BigInt(250000000000000000),
    highestBidder: "0xAAAA...BBBB",
    endTime: nowInSeconds + BigInt(60 * 60 * 12),
  };
}

export async function fetchAllActiveAuctions(): Promise<AuctionData[]> {
  const nowInSeconds = BigInt(Math.floor(Date.now() / 1000));

  return [
    {
      auctionId: BigInt(101),
      storefrontId: BigInt(1),
      seller: "0x1234...ABCD",
      listingName: "Rare Emerald Necklace",
      itemUri: "https://placehold.co/400x400/00d164/white?text=NFT+AUCTION+1",
      currentBid: BigInt(500000000000000000),
      highestBidder: "0xAAAA...BBBB",
      endTime: nowInSeconds + BigInt(60 * 60 * 24),
    },
    {
      auctionId: BigInt(102),
      storefrontId: BigInt(2),
      seller: "0x5678...EFGH",
      listingName: "Limited Edition Jumper",
      itemUri: "https://placehold.co/400x400/3498db/white?text=NFT+AUCTION+2",
      currentBid: BigInt(1500000000000000000),
      highestBidder: "0xCCCC...DDDD",
      endTime: nowInSeconds + BigInt(60 * 60 * 6),
    },
  ];
}
