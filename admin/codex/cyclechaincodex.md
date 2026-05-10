🔄 Cycle Chain Codex
PO → Sale → Shipping → RMA → Credit  
Operational Story • Lineage Flow • X‑ID Anchors

1. Purpose
To document the full operational life of a transaction on ListToBid.  
The Cycle Chain is the heartbeat of the marketplace — the sequence that every sale must pass through, from intention to resolution.

This scroll explains:

- What each cycle is  
- What triggers it  
- What X‑IDs it anchors  
- What fees attach  
- What trust events attach  
- How the cycles link to each other  
- How the Vault panels reference them  

This is the narrative backbone of the entire system.

---

2. The Five Cycles

2.1 PO Cycle (Purchase Order)
Purpose: The moment a buyer commits to purchase.  
Trigger: Buyer clicks “Buy Now” or completes checkout.  
X‑ID Anchor: POXID  
Parent: Product X‑ID  
Cross‑Links: Listing X‑ID, Buyer X‑ID  

Notes:  
- No money moves yet  
- No fees are created  
- This is the “intention” cycle  
- The PO becomes the first sibling in the chain  

---

2.2 Sale Cycle
Purpose: The moment the transaction becomes real.  
Trigger: Payment is authorized and captured.  
X‑ID Anchor: SALXID  
Parent: Product X‑ID  
Siblings: PO, Shipping, RMA, Credit  
Cross‑Links:  
- Platform fee  
- Credit card fee  
- Residual payout  
- Referral event  
- Trust events  

Notes:  
- This is the anchor cycle  
- All other cycles reference this one  
- All fees attach here  
- Residuals are born here  

---

2.3 Shipping Cycle
Purpose: The movement of the item from seller to buyer.  
Trigger: Seller marks item as shipped or tracking is detected.  
X‑ID Anchor: SHPXID  
Parent: Sale X‑ID  
Cross‑Links:  
- Handling fee  
- Delivery confirmation  
- Trust events  

Notes:  
- The handling fee attaches here  
- Delivery confirmation is a trust event  
- This cycle determines when funds can be released  

---

2.4 RMA Cycle (Return Merchandise Authorization)
Purpose: The buyer initiates a return or dispute.  
Trigger: Buyer requests return or files a dispute.  
X‑ID Anchor: RMAXID  
Parent: Sale X‑ID  
Cross‑Links:  
- Trust events  
- Admin actions  
- Resolution events  

Notes:  
- This is the conflict cycle  
- Trust Ledger references this heavily  
- RMA does not automatically trigger a credit  

---

2.5 Credit Cycle
Purpose: The final resolution of the sale.  
Trigger: RMA is approved or partial credit is issued.  
X‑ID Anchor: CRDXID  
Parent: RMA X‑ID  
Cross‑Links: Sale X‑ID  

Notes:  
- This is the only dual‑linked cycle  
- It references both RMA and Sale  
- It closes the operational chain  

---

3. The Cycle Chain (Full Sequence)

`
PO → Sale → Shipping → (optional) RMA → (optional) Credit
`

Rules of the Chain
- PO always comes first  
- Sale always anchors the chain  
- Shipping always follows Sale  
- RMA is optional  
- Credit is optional and only follows RMA  

This is the immutable order.

---

4. X‑ID Anchoring

Each cycle receives:

`
Cycle.self = <CycleXID>
Cycle.parent = <SaleXID or RMAXID>
Cycle.siblings = [POXID, SALXID, SHPXID, RMAXID, CRDXID]
Cycle.cross_links = [ProductXID, ListingXID, FeeXIDs, TrustEventXIDs]
`

This is how the Vault can:

- Expand drawers  
- Show lineage  
- Link fees  
- Link trust  
- Link residuals  
- Link disputes  
- Link credits  

Everything flows through the chain.

---

5. Vault Panel Integration

Earnings Lineage Panel
Shows:  
- Sale  
- Fees  
- Residuals  
- Platform net  

Platform Fees & Cycles Panel
Shows:  
- PO  
- Sale  
- Shipping  
- RMA  
- Credit  
- All fees attached to each  

Trust Ledger Panel
Shows:  
- Disputes  
- Confirmations  
- Resolutions  
- Admin actions  

Referral Constellation Panel
Shows:  
- Residuals triggered by the Sale cycle  

Steward Residuals Panel
Shows:  
- Residual payouts linked to the Sale cycle  

---

6. Stewardship Notes
- The Cycle Chain is the operational truth of ListToBid  
- No cycle can be skipped  
- No cycle can be reordered  
- No cycle can be deleted  
- Credits must always reference RMA  
- Sale must always anchor the chain  
- The Vault panels must always reference the same X‑IDs  
