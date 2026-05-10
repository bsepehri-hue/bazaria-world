✅ Storefront Lineage Rules
This is the bridge between the marketplace and the Vault — the scroll that explains how storefronts inherit identity, propagate lineage, and anchor the operational cycles you’ve already documented.

Below is your Codex‑ready file, clean and ready to drop into admin/codex as:

storefrontlineagerules.md

---

🏪 Storefront Lineage Rules
Steward Identity • Merchant Identity • Listing Lineage

1. Purpose
To define how storefronts participate in the X‑ID system and how they propagate lineage into:

- Listings  
- Products  
- Sales  
- Fees  
- Trust events  
- Residuals  
- Vault panels  

Storefronts are not just UI containers — they are lineage objects with their own identity and inheritance rules.

---

2. Storefront Identity (STF‑XID)

Every storefront receives:

`
STF-<epoch>-<hash>
`

Parent:
- Steward X‑ID (if steward‑owned)  
- Merchant X‑ID (if merchant‑owned)  

Cross‑Links:
- Listings  
- Products  
- Sales  
- Trust events  
- Residuals  

Notes:
- Storefronts are identity anchors  
- They define the “home” of listings  
- They determine referral and residual routing  

---

3. Storefront → Listing Lineage

Every listing inherits:

- The Storefront X‑ID  
- The Merchant X‑ID  
- The Steward X‑ID (if applicable)  

Listing.parent = StorefrontXID

Listing.cross_links = [ProductXID, MerchantXID, StewardXID]

This ensures:

- Earnings Lineage knows where the sale originated  
- Referral Constellation knows who brought the merchant  
- Trust Ledger knows who is responsible  
- Platform Fees & Cycles knows which storefront generated the sale  

---

4. Storefront → Product Lineage

Products may appear in multiple storefronts, but:

The product’s parent never changes.
It always belongs to the merchant.

However, each storefront that displays the product creates a cross‑link:

`
Product.cross_links.push(StorefrontXID)
`

This allows:

- Multi‑storefront visibility  
- Cross‑storefront analytics  
- Steward attribution  
- Residual routing  

---

5. Storefront → Sale Lineage

Every sale inherits the storefront identity:

`
Sale.cross_links.push(StorefrontXID)
`

This is critical because:

- Earnings Lineage uses it to group sales  
- Referral Constellation uses it to assign residuals  
- Trust Ledger uses it to determine responsibility  
- Platform Fees & Cycles uses it to calculate storefront‑level fees  

Storefront identity is part of every sale’s lineage.

---

6. Storefront → Fee Lineage

Fees attach to the sale, but they must reference the storefront:

- Platform fee → Storefront X‑ID  
- Credit card fee → Storefront X‑ID  
- Handling fee → Storefront X‑ID  
- RMA fee → Storefront X‑ID  

This allows:

- Storefront‑level profitability  
- Steward residual calculations  
- Merchant performance analytics  

---

7. Storefront → Trust Lineage

Trust events must reference the storefront:

- Disputes  
- Confirmations  
- Resolutions  
- Admin overrides  

TrustEvent.cross_links.push(StorefrontXID)

This ensures:

- Trust Ledger can filter by storefront  
- Adminflow can see which storefront is responsible  
- Dispute resolution can identify patterns  

---

8. Storefront → Residual Lineage

Residuals are triggered by the Sale cycle, but they must reference:

- Steward X‑ID  
- Storefront X‑ID  
- Sale X‑ID  

This allows:

- Steward Residuals Panel to show storefront‑level earnings  
- Referral Constellation to map residual flows  
- Earnings Lineage to show residual breakdowns  

---

9. Storefront Lineage Chain Format

Every storefront stores:

`
{
  "self": "<StorefrontXID>",
  "parent": "<StewardXID or MerchantXID>",
  "siblings": [],
  "cross_links": [
      "<ListingXID>",
      "<ProductXID>",
      "<SaleXID>",
      "<TrustEventXID>",
      "<ResidualXID>"
  ]
}
`

This makes the storefront a first‑class lineage object.

---

10. Stewardship Notes
- Storefronts are identity anchors, not UI containers  
- Every listing must inherit its storefront  
- Every sale must cross‑link its storefront  
- Fees must reference storefront identity  
- Trust events must reference storefront identity  
- Residuals must reference storefront identity  
- Storefront lineage must be immutable  
