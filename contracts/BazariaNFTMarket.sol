// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Bazaria NFT Market
 * @dev Non-custodial USDC marketplace for ERC-721 digital assets. 
 * Features atomic NFT transfers, 3% platform fees, and off-chain Agent Vault tracking.
 */

// Interface for USDC Token
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

// Interface for ERC-721 NFTs
interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

contract BazariaNFTMarket {
    address public owner;
    address public treasuryWallet;
    
    IERC20 public usdcToken;

    // Fees are calculated in basis points (300 = 3%)
    uint256 public platformFeePoints = 300; 

    struct Listing {
        uint256 id;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId = 1;

    // Events for your Firebase backend to track sales and credit the Agent Vault
    event ItemListed(uint256 indexed id, address indexed seller, address nftContract, uint256 tokenId, uint256 price);
    event ItemSold(
        uint256 indexed id, 
        address indexed buyer, 
        address indexed seller, 
        address nftContract,
        uint256 tokenId,
        uint256 price, 
        uint256 platformFee,
        string referralId 
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @param _usdcToken The contract address for USDC (e.g., on Polygon Amoy)
     * @param _treasuryWallet The Bazaria wallet that collects the 3% platform fee
     */
    constructor(address _usdcToken, address _treasuryWallet) {
        owner = msg.sender;
        treasuryWallet = _treasuryWallet;
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev List an NFT for sale. 
     * IMPORTANT: The Seller must first call `approve(BazariaContractAddress, tokenId)` on the NFT contract itself.
     */
    function listAsset(address _nftContract, uint256 _tokenId, uint256 _price) external {
        require(_price > 0, "Price cannot be zero");
        
        // Safety Check: Verify that the seller actually granted Bazaria permission to move the NFT
        IERC721 nft = IERC721(_nftContract);
        require(
            nft.getApproved(_tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)),
            "Bazaria Market is not approved to transfer this NFT"
        );
        
        listings[nextListingId] = Listing({
            id: nextListingId,
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        emit ItemListed(nextListingId, msg.sender, _nftContract, _tokenId, _price);
        nextListingId++;
    }

    /**
     * @dev Purchase the NFT using USDC.
     * @param _id The ID of the Bazaria listing.
     * @param _referralId The Agent's ID (e.g., "BZ-AGENT-7742"). This is broadcast to Firebase.
     */
    function buyAsset(uint256 _id, string memory _referralId) external {
        Listing storage item = listings[_id];
        require(item.active, "Item is no longer available");
        require(msg.sender != item.seller, "Cannot purchase your own listing");

        uint256 price = item.price;
        uint256 platformFee = (price * platformFeePoints) / 10000; 
        uint256 sellerProceeds = price - platformFee;

        // 1. Route USDC to Seller
        require(usdcToken.transferFrom(msg.sender, item.seller, sellerProceeds), "Seller USDC payment failed");

        // 2. Route USDC 3% Fee to Bazaria Treasury
        require(usdcToken.transferFrom(msg.sender, treasuryWallet, platformFee), "Treasury fee payment failed");

        // 3. ATOMIC PASS-THROUGH: Transfer the NFT directly from Seller to Buyer
        IERC721(item.nftContract).transferFrom(item.seller, msg.sender, item.tokenId);

        // Finalize transaction
        item.active = false;
        
        // Broadcast the sale and referral ID to Firebase
        emit ItemSold(_id, msg.sender, item.seller, item.nftContract, item.tokenId, price, platformFee, _referralId);
    }

    /**
     * @dev Allows the owner to adjust the platform fee. Capped at 10% to protect users.
     */
    function updatePlatformFee(uint256 _newFeePoints) external onlyOwner {
        require(_newFeePoints <= 1000, "Fee cannot exceed 10%");
        platformFeePoints = _newFeePoints;
    }
}
```eof

### Goal 3: Restore the Stripe Checkout & Auction Terms Modal

Now we tackle the legacy Stripe/Fiat engine. I have built a dedicated React component that handles the complex math from your `Bazaria Auction Logic` document and forces the user to accept the terms *before* paying.

**Key Logic Implemented Here:**
*   Checks if the bid is under $5,000 (standard fee) or over $5,000 (10% binder escrow).
*   Calculates the 6% reserve fee + 15% overage fee dynamically.
*   Displays the stern warning about the 10% non-refundable default fine for high-ticket items.

```tsx:AuctionCheckoutModal.tsx
import React, { useState, useMemo } from 'react';
import { AlertTriangle, FileText, ShieldCheck } from 'lucide-react';

interface AuctionCheckoutProps {
  assetId: string;
  title: string;
  reservePrice: number;
  finalBidAmount: number;
  onConfirmPayment: (amountToCharge: number) => void;
  onCancel: () => void;
}

export default function AuctionCheckoutModal({
  assetId,
  title,
  reservePrice,
  finalBidAmount,
  onConfirmPayment,
  onCancel
}: AuctionCheckoutProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  // --- BAZARIA AUCTION LOGIC MATH ENGINE ---
  const isHighTicket = finalBidAmount >= 5000;

  const metrics = useMemo(() => {
    if (!isHighTicket) {
      // Branch A: Under $5,000 (6% on reserve, 15% on overage)
      let fee = 0;
      if (finalBidAmount <= reservePrice || reservePrice === 0) {
        fee = finalBidAmount * 0.06;
      } else {
        const reserveFee = reservePrice * 0.06;
        const overageFee = (finalBidAmount - reservePrice) * 0.15;
        fee = reserveFee + overageFee;
      }
      return {
        mode: 'Standard',
        totalPrice: finalBidAmount,
        fee: fee,
        dueToday: finalBidAmount + fee,
        penaltyInfo: 0
      };
    } else {
      // Branch B: Over $5,000 (10% Binder Fee, handled via Escrow later)
      const binderDeposit = finalBidAmount * 0.10;
      const penaltyAmount = binderDeposit * 0.10; // 10% of deposit forfeited if buyer defaults
      return {
        mode: 'High-Ticket Escrow',
        totalPrice: finalBidAmount,
        fee: 0, // Handled backend
        dueToday: binderDeposit, 
        penaltyInfo: penaltyAmount
      };
    }
  }, [finalBidAmount, reservePrice, isHighTicket]);

  return (
    <div className="fixed inset-0 bg-[#031d20]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-[#f8fafc]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-[#0d9488]" />
            <span className="text-[10px] font-black text-[#0d9488] tracking-widest uppercase">
              Secure Fiat Gateway
            </span>
          </div>
          <h2 className="text-xl font-black text-[#0f172a] uppercase">{title}</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Final Commited Bid: <span className="text-slate-800">${finalBidAmount.toLocaleString()} USD</span>
          </p>
        </div>

        {/* Math & Logic Container */}
        <div className="p-6 flex flex-col gap-6">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            {!isHighTicket ? (
              // UI FOR UNDER $5000
              <>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Asset Final Price:</span>
                  <span>${metrics.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Auction Fee (Calculated):</span>
                  <span>${metrics.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0d9488] border-t border-slate-200 pt-3 mt-1">
                  <span>Total Due Now:</span>
                  <span>${metrics.dueToday.toLocaleString()} USD</span>
                </div>
              </>
            ) : (
              // UI FOR OVER $5000 (ESCROW)
              <>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Asset Final Price:</span>
                  <span>${metrics.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0d9488] border-t border-slate-200 pt-3 mt-1">
                  <span>10% Binder Deposit Due Now:</span>
                  <span>${metrics.dueToday.toLocaleString()} USD</span>
                </div>
                
                {/* Penalty Warning Box */}
                <div className="mt-3 bg-[#fef2f2] border border-[#fca5a5] p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={20} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[#991b1b] uppercase tracking-wide mb-1">
                      High-Ticket Escrow Policy
                    </span>
                    <p className="text-[11px] text-[#7f1d1d] font-semibold leading-relaxed">
                      You are authorizing a 10% Escrow Binder to secure this asset for off-platform settlement. 
                      If you back out, a 10% penalty (<strong>${metrics.penaltyInfo.toLocaleString()} USD</strong>) is strictly non-refundable. The remainder is handled via Escrow for up to 90 days.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Terms of Business Checkbox */}
          <label className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input 
              type="checkbox" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#0d9488] rounded focus:ring-[#0d9488] cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <FileText size={14} /> Accept Terms of Business
              </span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                I agree to the Bazaria Escrow logic, fee structures, and the {isHighTicket ? 'penalty forfeiture policies' : 'shipping and fulfillment policies'} as outlined in the official legal documentation.
              </span>
            </div>
          </label>

        </div>

        {/* Footer Buttons */}
        <div className="p-6 bg-[#f8fafc] border-t border-slate-200 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          
          <button 
            disabled={!termsAccepted}
            onClick={() => onConfirmPayment(metrics.dueToday)}
            className={`flex-[2] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              termsAccepted 
                ? 'bg-[#0f172a] text-[#FFBF00] border border-[#FFBF00] shadow-xl hover:bg-slate-800' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {termsAccepted ? `Pay $${metrics.dueToday.toLocaleString()} via Stripe` : 'Accept Terms to Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}
```eof

### How to use these right now:
1.  **For the Smart Contract:** You can copy the code from `BazariaNFTMarket.sol` directly into Remix. Compile it, and deploy it onto Polygon Amoy just like we did yesterday. Remember to copy the new contract address!
2.  **For the UI:** You can drop `AuctionCheckoutModal.tsx` into your `components/` folder. You will hook this up in your UI so that when a user clicks "Fiat/Card" to pay for an auction item, this modal pops up instead of immediately triggering Stripe.

This accomplishes Goals 1 and 2 perfectly. Shall we look at your Polygonscan history to try and hunt down the address for Goal 3 (the old Auction Contract), or do you want to deploy the new NFT Market first?
