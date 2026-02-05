import { JsonRpcProvider, Contract } from 'ethers';


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
  endTime: bigint; // Unix timestamp in seconds
}

// --- Ethers Setup ---
const POLYGON_AMOY_RPC = 'https://rpc-amoy.polygon.technology/'; 
const provider = new JsonRpcProvider(POLYGON_AMOY_RPC);
const contract = new Contract(CONTRACT_ADDRESS, LIST_TO_BID_ABI, provider);

// --- Storefront Fetcher (Same as before) ---
export async function fetchAllStorefronts(): Promise<StorefrontData[]> {
  // ... (implementation remains the same)
  try {
    const rawStorefronts: any[] = await contract.getAllStorefronts(); 
    
    const storefronts: StorefrontData[] = rawStorefronts.map((raw) => ({
      id: raw[0] as bigint,
      owner: raw[1] as string,
      name: raw[2] as string,
      profileDataUri: raw[3] as string,
      totalListings: raw[4] as bigint,
    }));

    return storefronts;

  } catch (error) {
    console.error('Error fetching storefronts from blockchain:', error);
    return [
      { id: BigInt(1), owner: '0x1234...ABCD', name: "Emily's Crafts", profileDataUri: 'https://placehold.co/400x200/2ecc71/white?text=EMILY', totalListings: BigInt(15) },
      { id: BigInt(2), owner: '0x5678...EFGH', name: "Jumper's Outfits", profileDataUri: 'https://placehold.co/400x200/3498db/white?text=JUMPER', totalListings: BigInt(22) },
    ];
  }
}

// --- Auction Fetchers (Updated) ---

// Assume contract has a function getAuctionById(uint256 auctionId) returns (Auction)
/**
 * Fetches a single auction by its ID from the ListToBid smart contract.
 */
export async function fetchAuctionById(auctionId: string): Promise<AuctionData> {
  const idBigInt = BigInt(auctionId);
  try {
    // We assume the ABI includes a getAuctionById function
    const raw: any = await contract.getAuctionById(idBigInt); 
    
    const auction: AuctionData = {
      auctionId: raw[0] as bigint,
      storefrontId: raw[1] as bigint,
      seller: raw[2] as string,
      listingName: raw[3] as string,
      itemUri: raw[4] as string,
      currentBid: raw[5] as bigint,
      highestBidder: raw[6] as string,
      endTime: raw[7] as bigint,
    };

    return auction;

  } catch (error) {
    console.error(`Error fetching auction ${auctionId} from blockchain. Using mock data.`, error);
    
    // Fallback: Mock data for development/testing
    const nowInSeconds = BigInt(Math.floor(Date.now() / 1000));
    return { 
      auctionId: idBigInt, 
      storefrontId: BigInt(1), 
      seller: '0x1234...ABCD', 
      listingName: `Dynamic Auction #${auctionId}: Rare Ancient Scroll`, 
      itemUri: 'https://placehold.co/800x600/024c05/white?text=Ancient+Scroll+Listing', 
      currentBid: BigInt(250000000000000000), // 0.25 ETH
      highestBidder: '0xAAAA...BBBB',
      endTime: nowInSeconds + BigInt(60 * 60 * 12), // Ends in 12 hours
    };
  }
}

// ... (fetchAllActiveAuctions remains the same)
export async function fetchAllActiveAuctions(): Promise<AuctionData[]> {
  // ... (implementation remains the same)
    const nowInSeconds = BigInt(Math.floor(Date.now() / 1000));
    return [
      { 
        auctionId: BigInt(101), 
        storefrontId: BigInt(1), 
        seller: '0x1234...ABCD', 
        listingName: "Rare Emerald Necklace", 
        itemUri: 'https://placehold.co/400x400/00d164/white?text=NFT+AUCTION+1', 
        currentBid: BigInt(500000000000000000), // 0.5 ETH (or WETH)
        highestBidder: '0xAAAA...BBBB',
        endTime: nowInSeconds + BigInt(60 * 60 * 24), // Ends in 24 hours
      },
      { 
        auctionId: BigInt(102), 
        storefrontId: BigInt(2), 
        seller: '0x5678...EFGH', 
        listingName: "Limited Edition Jumper", 
        itemUri: 'https://placehold.co/400x400/3498db/white?text=NFT+AUCTION+2', 
        currentBid: BigInt(1500000000000000000), // 1.5 ETH
        highestBidder: '0xCCCC...DDDD',
        endTime: nowInSeconds + BigInt(60 * 60 * 6), // Ends in 6 hours
      },
    ];
}
