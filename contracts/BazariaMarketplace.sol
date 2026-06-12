// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Minimal ERC20 Interface for USDC interaction
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

/**
 * @title Bazaria Sovereign Settlement Engine (USDC)
 */
contract BazariaMarketplace is ReentrancyGuard { 
    
    IERC20 public immutable usdcToken;
    address public platformManager;
    uint256 public constant PLATFORM_FEE_BPS = 600; // 6%

    struct AssetListing {
        string id;
        address seller;
        uint256 buyNowPrice; // Needed for the buyAsset function
        uint256 reservePrice;
        uint256 highestBid;
        address highestBidder;
        bool active;
        bool finalized;
    }

    // Mapping using string (Firebase ID) to the Asset Listing
    mapping(string => AssetListing) public listings;
    
    // Tracks pending USDC returns for outbid users
    mapping(address => uint256) public pendingReturns;

    event AssetRegistered(string indexed assetId, address indexed seller, uint256 buyNowPrice, uint256 reservePrice);
    event BidPlaced(string indexed assetId, address indexed bidder, uint256 amount);
    event AssetPurchased(string indexed assetId, address indexed buyer, uint256 amount);
    event SettlementFinalized(string indexed assetId, address winner, uint256 clearingPrice, uint256 platformCut);
    event FundsWithdrawn(address indexed participant, uint256 amount);

    modifier onlyManager() {
        require(msg.sender == platformManager, "Protocol Exception: Unauthorized management access.");
        _;
    }

    // Initialize with the Polygon Amoy USDC Contract Address
    constructor(address _usdcAddress) {
        platformManager = msg.sender;
        usdcToken = IERC20(_usdcAddress);
    }

    // 1. Merchant registers the asset on-chain
    function listAsset(string memory _assetId, uint256 _buyNowPrice, uint256 _reservePrice) external {
        require(!listings[_assetId].active, "Protocol Exception: Cryptographic registry entry already occupied.");

        listings[_assetId] = AssetListing({
            id: _assetId,
            seller: msg.sender,
            buyNowPrice: _buyNowPrice,
            reservePrice: _reservePrice,
            highestBid: 0,
            highestBidder: address(0),
            active: true,
            finalized: false
        });

        emit AssetRegistered(_assetId, msg.sender, _buyNowPrice, _reservePrice);
    }

    // 2. Buyer places a bid (Pulls USDC via transferFrom)
    function placeBid(string memory _assetId, uint256 _amount) external nonReentrant {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target registry entry is inactive.");
        require(!listing.finalized, "Protocol Exception: Target settlement has closed.");
        
        uint256 minimumRequiredBid = listing.highestBid == 0 ? listing.reservePrice : listing.highestBid;
        require(_amount > minimumRequiredBid, "Protocol Exception: Allocation insufficient.");

        // Pull the USDC from the bidder into this contract (Requires prior 'approve' from frontend)
        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed.");

        // If someone was already outbid, add their previous bid to pending returns
        if (listing.highestBidder != address(0)) {
            pendingReturns[listing.highestBidder] += listing.highestBid;
        }

        listing.highestBidder = msg.sender;
        listing.highestBid = _amount;

        emit BidPlaced(_assetId, msg.sender, _amount);
    }

    // 3. Buyer uses "Buy It Now" (Pulls full USDC amount and finalizes)
    function buyAsset(string memory _assetId) external nonReentrant {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target registry entry is inactive.");
        require(!listing.finalized, "Protocol Exception: Target settlement has closed.");
        require(listing.buyNowPrice > 0, "Protocol Exception: Asset not available for instant purchase.");

        // Pull the exact Buy Now price in USDC from the buyer
        require(usdcToken.transferFrom(msg.sender, address(this), listing.buyNowPrice), "USDC transfer failed.");

        // Refund the current highest bidder if an auction was ongoing but someone bought it outright
        if (listing.highestBidder != address(0)) {
            pendingReturns[listing.highestBidder] += listing.highestBid;
        }

        listing.highestBidder = msg.sender;
        listing.highestBid = listing.buyNowPrice;
        listing.active = false; // Immediately close the asset
        listing.finalized = true;

        // Auto-distribute funds for a Buy It Now
        uint256 platformCut = (listing.buyNowPrice * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerPayout = listing.buyNowPrice - platformCut;

        require(usdcToken.transfer(platformManager, platformCut), "Fee transfer failed.");
        require(usdcToken.transfer(listing.seller, sellerPayout), "Seller payout failed.");

        emit AssetPurchased(_assetId, msg.sender, listing.buyNowPrice);
    }

    // 4. Outbid users can withdraw their USDC
    function withdrawPendingReturns() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "Protocol Exception: Zero withdrawal allocation detected.");

        pendingReturns[msg.sender] = 0;
        require(usdcToken.transfer(msg.sender, amount), "USDC return failed.");

        emit FundsWithdrawn(msg.sender, amount);
    }

    // 5. Manager finalizes a standard auction
    function finalizeSettlement(string memory _assetId) external onlyManager nonReentrant {
        AssetListing storage listing = listings[_assetId];
        require(listing.active, "Protocol Exception: Target asset tracking uninitialized.");
        require(!listing.finalized, "Protocol Exception: Clearance sequence already executed.");
        
        listing.finalized = true;
        listing.active = false;

        uint256 highestBidAmount = listing.highestBid;
        uint256 platformCut = (highestBidAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerPayout = highestBidAmount - platformCut;

        require(usdcToken.transfer(platformManager, platformCut), "Fee transfer failed.");
        require(usdcToken.transfer(listing.seller, sellerPayout), "Seller payout failed.");

        emit SettlementFinalized(_assetId, listing.highestBidder, highestBidAmount, platformCut);
    }
}
