✅ Cycle Chain Visual Map
This is the visual counterpart to the Cycle Chain Codex you already sealed.  
Where the Codex explains the story, this scroll gives you the diagrammatic, structural, operational map — the thing you’ll eventually turn into UI, adminflow navigation, and onboarding clarity.

Below is your Codex‑ready file, clean and ready to drop into admin/codex as:

cyclechainvisual_map.md

---

🔄 Cycle Chain Visual Map
Diagram • Flow • Lineage Anchors

1. Purpose
To provide a visual, structural representation of the Cycle Chain:

PO → Sale → Shipping → RMA → Credit

This map is used for:

- Adminflow navigation  
- Vault panel linking  
- Developer onboarding  
- Steward education  
- Dispute reconstruction  
- Lineage debugging  

It is the visual heartbeat of the marketplace.

---

2. High‑Level Diagram

`
 ┌──────────┐       ┌──────────┐       ┌────────────┐       ┌──────────┐       ┌──────────┐
 │   PO     │  ───► │   Sale   │  ───► │  Shipping  │  ───► │   RMA    │  ───► │  Credit  │
 └──────────┘       └──────────┘       └────────────┘       └──────────┘       └──────────┘
       │                  │                   │                   │                   │
       ▼                  ▼                   ▼                   ▼                   ▼
   POXID             SALXID              SHPXID              RMAXID              CRDXID
`

Notes:
- RMA and Credit are optional  
- Sale is the anchor  
- Shipping always follows Sale  
- Credit always follows RMA  

---

3. Cycle Chain With X‑ID Parents

`
PO (parent: ProductXID)
   ↓
Sale (parent: ProductXID)
   ↓
Shipping (parent: SaleXID)
   ↓
RMA (parent: SaleXID)
   ↓
Credit (parent: RMAXID)
`

This shows the parent lineage, not just the sequence.

---

4. Cycle Chain With Cross‑Links

`
PO
 │
 ├── ListingXID
 ├── ProductXID
 └── BuyerXID

Sale
 │
 ├── PlatformFeeXID
 ├── CreditCardFeeXID
 ├── ResidualXID
 ├── ReferralXID
 └── StorefrontXID

Shipping
 │
 ├── HandlingFeeXID
 └── DeliveryEventXID

RMA
 │
 ├── DisputeXID
 ├── EvidenceXIDs
 └── AdminActionXIDs

Credit
 │
 ├── RefundXID
 └── AdjustmentXID
`

This shows how each cycle interacts with the rest of the system.

---

5. Cycle Chain With Vault Panel Mapping

`
PO        → Platform Fees & Cycles Panel
Sale      → Earnings Lineage Panel
Shipping  → Platform Fees & Cycles Panel
RMA       → Trust Ledger Panel
Credit    → Earnings Lineage Panel
`

This is how the Vault knows which drawer to open.

---

6. Cycle Chain With Trust Events

`
PO        → TrustEvent: PO Created
Sale      → TrustEvent: Payment Captured
Shipping  → TrustEvent: Item Shipped / Delivered
RMA       → TrustEvent: Return Requested / Approved / Rejected
Credit    → TrustEvent: Credit Issued
`

Every cycle creates at least one Trust Event.

---

7. Cycle Chain With Adminflow Actions

`
PO        → Cancel PO
Sale      → Reverse Sale / Reauthorize
Shipping  → Override Delivery / Add Tracking
RMA       → Approve / Reject / Escalate
Credit    → Issue Full / Partial Credit
`

Adminflow interacts with the chain at predictable points.

---

8. Cycle Chain With Error States

`
PO        → Orphaned PO (no Sale)
Sale      → Payment Failure
Shipping  → Lost Package / No Tracking
RMA       → Missing Evidence / Timeout
Credit    → Incorrect Amount / Double Credit
`

These feed into the X‑ID Error States & Recovery Rules scroll (coming next).

---

9. Stewardship Notes
- The visual map must always match the Codex  
- The chain must never be reordered  
- The chain must never skip a cycle  
- The chain must never be broken  
- The chain must always be lineage‑anchored  
- The chain must always be validated before expansion  
