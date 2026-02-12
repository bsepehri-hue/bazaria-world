// /src/auctions/BidHistory.tsx
import React from 'react';
import { Clock, User } from 'lucide-react';
import { Bid } from "@/types/auction";
import { shortenAddress, formatEther } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface BidHistoryProps {
  bids: Bid[];
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids }) => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-teal-600" />
        Bid History
      </h3>

      {bids.length === 0 ? (
        <p className="text-gray-500 italic">No bids placed yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {bids.map((bid, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-2 ${
                index > 0 ? 'border-t border-gray-100' : ''
              }`}
            >
              {/* Bidder & Highest badge */}
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">
                  {shortenAddress(bid.bidder, 6)}
                  {index === 0 && (
                    <span className="ml-2 text-xs font-bold text-teal-600">
                      (Highest)
                    </span>
                  )}
                </span>
              </div>

              {/* Amount & Timestamp */}
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  {formatEther(bid.amount)}{' '}
                  <span className="text-sm text-teal-600">ETH</span>
                </p>
                <p className="text-xs text-gray-500">
                  {bid.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default BidHistory;
