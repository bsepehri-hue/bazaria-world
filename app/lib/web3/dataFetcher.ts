export type AuctionData = { id: string; title: string };

export async function fetchAllActiveAuctions(): Promise<AuctionData[]> {
  // Stubbed data for now
  return [
    { id: "1", title: "Stub Auction 1" },
    { id: "2", title: "Stub Auction 2" },
  ];
}
