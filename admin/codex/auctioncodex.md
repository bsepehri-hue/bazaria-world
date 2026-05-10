✅ Auction Codex
File: auctioncodex.md_  
Timing • Tension • Transformation

---

🏛️ 1. Purpose

To define how auctions operate inside ListToBid:

- how they begin  
- how they evolve  
- how bids are recorded  
- how winners are determined  
- how lineage is anchored  
- how cycles are triggered  
- how trust and performance integrate  

Auctions are living events, not static listings.

---

🔗 2. Auction Identity (AUC‑XID)

Every auction receives a unique AuctionXID:

`
AUC‑<XID>
`

This identity links to:

- ListingXID  
- MerchantXID  
- BidXIDs  
- WinnerXID  
- SaleXID  
- Cycle Chain  
- Earnings Lineage  
- Trust Ledger  

The auction becomes a lineage anchor for all bidding activity.

---

🧩 3. Auction Structure

An auction consists of:

✅ 3.1 Identity Layer
- title  
- description  
- category  
- condition  
- images  

✅ 3.2 Timing Layer
- start time  
- end time  
- countdown  
- soft‑close rules  

✅ 3.3 Bidding Layer
- bid increments  
- bid history  
- max‑bid logic  
- anti‑sniping protection  

✅ 3.4 Winner Layer
- winning bidder  
- final price  
- auto‑generated POXID  

✅ 3.5 Cycle Layer
- Sale Cycle  
- Shipping Cycle  
- Delivery Cycle  
- RMA Cycle  

✅ 3.6 Lineage Layer
- AuctionXID  
- BidXIDs  
- SaleXID  
- EarningsXID  

---

⏳ 4. Timing Rules

✅ 4.1 Hard Start
Auctions begin exactly at the declared start time.

✅ 4.2 Hard End (Base Rule)
Auctions end at the declared end time unless soft‑close is triggered.

✅ 4.3 Soft‑Close (Anti‑Sniping)
If a bid is placed within the final 30 seconds, the auction extends by +30 seconds.

This can repeat indefinitely.

Soft‑close ensures fairness and prevents last‑second manipulation.

---

💸 5. Bidding Rules

✅ 5.1 Minimum Bid
The lowest acceptable starting bid.

✅ 5.2 Bid Increment
The minimum amount each new bid must exceed the previous bid.

✅ 5.3 Max‑Bid (Proxy Bidding)
Users may enter a maximum bid.

The system will:

- automatically outbid others  
- only up to the user’s max  
- using the smallest increment necessary  

✅ 5.4 Bid Validity
A bid is valid only if:

- the user has a verified account  
- the bid meets increment rules  
- the auction is active  
- the user has no outstanding trust violations  

✅ 5.5 BidXID
Every bid generates a BidXID:

`
BID‑<XID>
`

Each BidXID is lineage‑anchored.

---

🧿 6. Auction Lineage Entry

`
{
  "auc_xid": "<AuctionXID>",
  "listing": "<ListingXID>",
  "merchant": "<MerchantXID>",
  "start_time": "<ISO>",
  "end_time": "<ISO>",
  "soft_close": true,
  "bids": [
    {
      "bidxid": "<BidXID>",
      "bidder": "<BuyerXID>",
      "amount": <decimal>,
      "timestamp": "<ISO>"
    }
  ],
  "winner": "<BuyerXID>",
  "final_price": <decimal>,
  "sale": "<SaleXID>",
  "status": "<active | ended | canceled>"
}
`

The auction is a living lineage object.

---

🏆 7. Winner Determination

The winner is:

- the highest valid bidder  
- at the moment the auction ends  
- after all soft‑close extensions  

Once determined:

1. WinnerXID is assigned  
2. POXID is generated  
3. Sale Cycle begins  
4. Earnings Lineage is created  
5. Residuals are calculated (if referral applies)  

The auction transitions into the Cycle Chain.

---

⚠️ 8. Auction Discrepancies

The Discrepancy Engine monitors for:

- bid manipulation  
- shill bidding  
- coordinated bidding  
- sudden bid spikes  
- repeated bid withdrawals  
- timing anomalies  

Critical discrepancies trigger:

- Trust Ledger entries  
- Auction suspension  
- Merchant or bidder review  

---

🔄 9. Auction Lifecycle

`
Created → Scheduled → Active → Soft‑Close (optional) → Ended → Sale Cycle → Shipping → Delivery → (RMA) → Closure
`

Every stage is lineage‑anchored.

---

🧬 10. Integration With Other Codices

The Auction Codex connects to:

- Listing Performance Codex  
- Merchant Performance Codex  
- Storefront Health Codex  
- Cycle Chain Codex  
- Earnings Lineage Codex  
- Steward Residuals Codex  
- Trust Ledger Codex  
- Discrepancy Engine Codex  

Auctions are a cross‑tier event.

---

🪶 11. Stewardship Notes

- Auctions must feel exciting, not chaotic.  
- Timing must be fair and transparent.  
- Bidding must be honest and traceable.  
- Lineage must be immutable.  
- The Bazar and Auction Codices must feel like siblings.  

---
