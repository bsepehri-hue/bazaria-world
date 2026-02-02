export interface AuctionData {
  auctionId: string;
  listingName: string;
  description: string;
  imageUrl: string;
  currentBid?: string;
  startingBid?: string;
  endsAt: Date | string;
  sellerAddress?: string;
  storefrontId?: string;
}
