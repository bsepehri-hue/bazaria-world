/**
 * Generates a shareable URL for an auction listing, optionally including a referral address.
 * * @param auctionId The ID of the auction.
 * @param refAddress The optional Ethereum address of the referrer.
 * @returns The complete, shareable URL string.
 */
export function generateShareableAuctionLink(auctionId: string | bigint, refAddress?: string): string {
  // Use a sensible base URL (e.g., your site's deployed domain or localhost for dev)
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/auctions/${auctionId}` 
    : `https://listtobid.com/auctions/${auctionId}`;

  const url = new URL(baseUrl);

  if (refAddress) {
    // Add the referral parameter if provided
    url.searchParams.set('ref', refAddress);
  }

  return url.toString();
}
