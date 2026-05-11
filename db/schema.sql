-- 1. Stewards Table (For Onboarding & Directory)
CREATE TABLE Stewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL,
    logo_url TEXT,
    category TEXT NOT NULL,
    description TEXT,
    is_verified BOOLEAN DEFAULT false, -- For the "Verified Steward" badge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Unified Listings Table (For Products & Auctions)
CREATE TABLE Listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    steward_id UUID REFERENCES Stewards(id), -- Foreign key
    title TEXT NOT NULL,
    description TEXT,
    images TEXT[], -- An array of image URLs
    
    listing_type TEXT NOT NULL, -- 'product' or 'auction'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'sold', 'archived'
    category TEXT,
    tags TEXT[],
    
    -- Product-specific fields
    price_in_cents INT,
    inventory_count INT,
    
    -- Auction-specific fields (for later)
    -- starting_bid_cents INT,
    -- auction_end_date TIMESTAMP,
    
    referral_code TEXT, -- As specified
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sales Table (For "The Steward's Purse")
CREATE TABLE Sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES Listings(id),
    steward_id UUID REFERENCES Stewards(id),
    buyer_id UUID, -- Assuming you have a Users table
    amount_paid_cents INT NOT NULL,
    referral_earned INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- 4. Agent Profiles Table (For Listing Agents & Representatives)
-- =========================================================
CREATE TABLE AgentProfile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'PENDING_KYC',
    kyc_document_hash TEXT,
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_assigned INTEGER DEFAULT 0,
    earnings_pool NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 5. Account Leads Table (For Orphan Account Routing)
-- =========================================================
CREATE TABLE AccountLead (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNASSIGNED',
    agent_id UUID REFERENCES AgentProfile(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    setup_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 6. Inquiries Table (For Inquiries-to-Leads Routing)
-- =========================================================
CREATE TABLE Inquiry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNASSIGNED',
    agent_id UUID REFERENCES AgentProfile(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    response_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 7. Add Shipping Columns to Sales Table
-- =========================================================
ALTER TABLE Sales 
  ADD COLUMN delivery_method TEXT NOT NULL DEFAULT 'SHIPPING', -- 'SHIPPING' or 'PICKUP'
  ADD COLUMN convenience_fee_cents INT DEFAULT 0,              -- Your flat $5.00 platform fee (500 cents)
  ADD COLUMN shipping_cost_cents INT DEFAULT 0;                -- What UPS actually charged for the label

-- =========================================================
-- 8. Shipments Table (Connects 1-to-1 with Sales)
-- =========================================================
CREATE TABLE Shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL UNIQUE REFERENCES Sales(id) ON DELETE CASCADE,
    
    -- UPS Carrier Details
    carrier TEXT NOT NULL DEFAULT 'UPS',
    tracking_number TEXT UNIQUE,
    shipping_label_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'LABEL_CREATED', 'IN_TRANSIT', 'DELIVERED', etc.
    
    -- Package Details (Passed to UPS API)
    weight_lbs NUMERIC(5, 2) NOT NULL,
    length_in NUMERIC(5, 2) NOT NULL,
    width_in NUMERIC(5, 2) NOT NULL,
    height_in NUMERIC(5, 2) NOT NULL,
    
    -- Buyer Shipping Address Details
    to_name TEXT NOT NULL,
    to_street TEXT NOT NULL,
    to_city TEXT NOT NULL,
    to_state TEXT NOT NULL,
    to_zip TEXT NOT NULL,
    to_country TEXT NOT NULL DEFAULT 'US',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
