🧬 X‑ID Linking Rules (Part 4 — Cycle Links)
Cycle Identity • Operational Chain • Immutable Flow

1. Purpose
To define how X‑IDs connect across the five operational cycles that govern every sale on ListToBid:

1. PO (Purchase Order)  
2. Sale  
3. Shipping  
4. RMA  
5. Credit

This section answers:  
“How do operational cycles form a single, traceable chain?”

---

2. Cycle Structure

Each cycle receives:

- Its own Cycle X‑ID  
- A parent (usually the sale or product)  
- A set of sibling events  
- A set of cross‑links (fees, trust events, residuals)

Cycles are the spine of the lineage system.

---

3. Cycle Linking Rules

Rule 1 — All cycles share the same Sale X‑ID as their anchor
This is the most important rule.

`
PO.parent = SaleXID  
Shipping.parent = SaleXID  
RMA.parent = SaleXID  
Credit.parent = SaleXID
`

Everything flows from the sale.

---

Rule 2 — Cycles must reference each other as siblings
This creates the horizontal lineage chain.

`
Sale.siblings = [POXID, ShippingXID, RMAXID, CreditXID]
Shipping.siblings = [SaleXID, POXID, RMAXID, CreditXID]
`

Every cycle knows its neighbors.

---

Rule 3 — Cycles must reference the product and listing as cross‑links
This ties the operational chain back to the commerce objects.

`
Cycle.cross_links = [ProductXID, ListingXID]
`

---

Rule 4 — Fees must reference the cycle they belong to
Examples:

- Platform fee → Sale cycle  
- Credit card fee → Sale cycle  
- Handling fee → Shipping cycle  
- RMA fee → RMA cycle  

This ensures financial lineage is accurate.

---

Rule 5 — Trust events must reference the cycle they affect
Examples:

- Dispute → Sale cycle  
- Delivery confirmation → Shipping cycle  
- Resolution → RMA cycle  

Trust is always anchored to a real operational moment.

---

Rule 6 — Residual payouts must reference the Sale cycle
Residuals are children of the sale.

`
Residual.parent = SaleXID
Residual.cross_links = [StewardXID]
`

---

Rule 7 — Credits must reference both the RMA and the Sale
Credits are the only cycle with two parents:

`
Credit.parent = RMAXID  
Credit.cross_links = [SaleXID]
`

This preserves the full lineage.

---

4. Cycle Lineage Chain Format

Every cycle stores:

`
{
  "self": "<CycleXID>",
  "parent": "<SaleXID>",
  "siblings": ["<CycleXID>", "<CycleXID>"],
  "cross_links": ["<ProductXID>", "<ListingXID>", "<FeeXID>", "<TrustEventXID>"]
}
`

This chain allows the Vault to:

- Expand cycle drawers  
- Show operational flow  
- Link fees to events  
- Link trust to cycles  
- Link residuals to sales  
- Link RMAs to credits  

---

5. Examples

Example 1 — Sale Cycle
`
Sale.self = SAL-epoch-hash
Sale.parent = PRD-epoch-hash
Sale.siblings = [POXID, ShippingXID, RMAXID, CreditXID]
Sale.cross_links = [PlatformFeeXID, ResidualXID]
`

---

Example 2 — Shipping Cycle
`
Shipping.self = SHP-epoch-hash
Shipping.parent = SAL-epoch-hash
Shipping.siblings = [POXID, RMAXID, CreditXID]
Shipping.cross_links = [HandlingFeeXID, DeliveryConfirmationXID]
`

---

Example 3 — RMA Cycle
`
RMA.self = RMA-epoch-hash
RMA.parent = SAL-epoch-hash
RMA.siblings = [POXID, ShippingXID, CreditXID]
RMA.cross_links = [TrustEventXID]
`

---

Example 4 — Credit Cycle
`
Credit.self = CRD-epoch-hash
Credit.parent = RMAXID
Credit.cross_links = [SaleXID]
`

---

6. Stewardship Notes
- Cycle links must never be altered  
- Sale is always the anchor  
- Credits are the only dual‑linked cycle  
- Fees must always attach to the correct cycle  
- Trust events must always attach to the cycle they affect  
- Cycle lineage is the operational backbone of the Vault  

