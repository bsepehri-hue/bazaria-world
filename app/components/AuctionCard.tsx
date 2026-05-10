"use client";

import React from "react";
import { AuctionData } from "@/app/types/auction";

type AuctionCardProps = {
  auction: AuctionData;
};

export default function AuctionCard({ auction }: AuctionCardProps) {
  return (
    <div className="l2b-card l2b-flex-col l2b-gap-3 l2b-cursor-pointer">
      <img
        src={auction.imageUrl}
        alt={auction.listingName}
        className="l2b-card-image"
      />

      <h2 className="l2b-text-bold l2b-text-lg">{auction.listingName}</h2>

      <p className="l2b-text-muted">{auction.description}</p>

      <p className="l2b-price">
        Current Bid: {auction.currentBid ?? auction.startingBid} ETH
      </p>

      <button className="l2b-button l2b-button-primary l2b-w-full l2b-text-center">
        View Auction →
      </button>
    </div>
  );
}
