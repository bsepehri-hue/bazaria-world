// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // Add this line

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

    // Mapping from unique registry Asset ID to listing parameters
    mapping(uint256 => AssetListing) public listings;
    
    // Tracks un-cleared funds for outbid participants to withdraw (Security Pattern)
    mapping(address => uint256) public pendingReturns;

    // Platform Governance Addresses
    address public platformManager;
    uint256 public constant PLATFORM_FEE_BPS = 600; // 6% documentation cut

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

    /**
     * @notice Registers an asset onto the immutable cryptographic ledger.
     * @param _assetId The unique inventory tracking number from the Bazaria indexer.
     * @param _reservePrice The minimum clearing floor requirement in Wei.
     */
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

    /**
     * @notice Places a cryptographic bid allocation on an active registry asset.
     * @param _assetId The unique target inventory ID.
     */
    function placeBid(uint256 _assetId) external payable {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target registry entry is inactive.");
        require(!listing.finalized, "Protocol Exception: Target settlement has closed.");
        
        // Ensure the incoming bid satisfies both minimum floor requirements and outbids the current leader
        uint256 minimumRequiredBid = listing.highestBid == 0 ? listing.reservePrice : listing.highestBid;
        require(msg.value > minimumRequiredBid, "Protocol Exception: Allocation insufficient to clear high bid threshold.");

        // Safe Escrow Handling: Credit back the previous highest bidder's capital balance for manual withdrawal
        if (listing.highestBidder != address(0)) {
            pendingReturns[listing.highestBidder] += listing.highestBid;
        }

        // Lock down the incoming balance into the contract state
        listing.highestBidder = payable(msg.sender);
        listing.highestBid = msg.value;

        emit BidPlaced(_assetId, msg.sender, msg.value);
    }

    /**
     * @notice Finalizes transaction clearance, routing split transaction percentages to platform metrics.
     * @param _assetId The target inventory item to close.
     */
    function finalizeSettlement(uint256 _assetId) external onlyManager {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target asset tracking uninitialized.");
        require(!listing.finalized, "Protocol Exception: Clearance sequence already executed.");
        require(listing.highestBidder != address(0), "Protocol Exception: No active bids allocated.");

        listing.finalized = true;
        listing.active = false;

        uint256 highestBidAmount = listing.highestBid;
        
        // Calculate structural splits matching Section 2.2 metrics (6% Platform Fee Cut)
        uint256 platformCut = (highestBidAmount * BAZARIA_MARKETPLACE_ABI_bps_helper()) / 10000;
        uint256 sellerPayout = highestBidAmount - platformCut;

        // Route settlements securely
        payable(platformManager).transfer(platformCut);
        listing.seller.transfer(sellerPayout);

        emit SettlementFinalized(_assetId, listing.highestBidder, highestBidAmount, platformCut);
    }

    /**
     * @notice Pull-Safety design pattern for outbid accounts to extract their locked deposits.
     */
    function withdrawPendingReturns() external {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "Protocol Exception: Zero withdrawal allocation detected.");

        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit FundsWithdrawn(msg.sender, amount);
    }

    function BAZARIA_MARKETPLACE_ABI_bps_helper() internal pure returns (uint256) {
        return PLATFORM_FEE_BPS;
    }
}
