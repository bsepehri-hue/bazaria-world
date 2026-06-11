// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Bazaria Sovereign Settlement Engine
 */
contract BazariaMarketplace is ReentrancyGuard { 
    
    struct AssetListing {
        uint256 id;
        address payable seller;
        uint256 reservePrice;
        uint256 highestBid;
        address payable highestBidder;
        bool active;
        bool finalized;
    }

    mapping(uint256 => AssetListing) public listings;
    mapping(address => uint256) public pendingReturns;

    address public platformManager;
    uint256 public constant PLATFORM_FEE_BPS = 600;

    event AssetRegistered(uint256 indexed assetId, address indexed seller, uint256 reservePrice);
    event BidPlaced(uint256 indexed assetId, address indexed bidder, uint256 amount);
    event SettlementFinalized(uint256 indexed assetId, address winner, uint256 clearingPrice, uint256 platformCut);
    event FundsWithdrawn(address indexed participant, uint256 amount);

    modifier onlyManager() {
        require(msg.sender == platformManager, "Protocol Exception: Unauthorized management access.");
        _;
    }

    constructor() {
        platformManager = msg.sender;
    }

    function listAsset(uint256 _assetId, uint256 _reservePrice) external {
        require(!listings[_assetId].active, "Protocol Exception: Cryptographic registry entry already occupied.");
        require(_reservePrice > 0, "Protocol Exception: Reserve price must exceed zero thresholds.");

        listings[_assetId] = AssetListing({
            id: _assetId,
            seller: payable(msg.sender),
            reservePrice: _reservePrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            active: true,
            finalized: false
        });

        emit AssetRegistered(_assetId, msg.sender, _reservePrice);
    }

    function placeBid(uint256 _assetId) external payable nonReentrant {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target registry entry is inactive.");
        require(!listing.finalized, "Protocol Exception: Target settlement has closed.");
        
        uint256 minimumRequiredBid = listing.highestBid == 0 ? listing.reservePrice : listing.highestBid;
        require(msg.value > minimumRequiredBid, "Protocol Exception: Allocation insufficient.");

        if (listing.highestBidder != address(0)) {
            pendingReturns[listing.highestBidder] += listing.highestBid;
        }

        listing.highestBidder = payable(msg.sender);
        listing.highestBid = msg.value;

        emit BidPlaced(_assetId, msg.sender, msg.value);
    }

    function finalizeSettlement(uint256 _assetId) external onlyManager nonReentrant {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target asset tracking uninitialized.");
        require(!listing.finalized, "Protocol Exception: Clearance sequence already executed.");
        
        listing.finalized = true;
        listing.active = false;

        uint256 highestBidAmount = listing.highestBid;
        uint256 platformCut = (highestBidAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerPayout = highestBidAmount - platformCut;

        payable(platformManager).transfer(platformCut);
        listing.seller.transfer(sellerPayout);

        emit SettlementFinalized(_assetId, listing.highestBidder, highestBidAmount, platformCut);
    }

    function withdrawPendingReturns() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "Protocol Exception: Zero withdrawal allocation detected.");

        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit FundsWithdrawn(msg.sender, amount);
    }
}
