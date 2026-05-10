📊 Merchant Performance Codex
Lineage‑Anchored Metrics • Storefront Impact • Trust Signals

1. Purpose
To define how ListToBid measures merchant performance using lineage‑anchored data from:

- Sales  
- Fees  
- Credits  
- RMAs  
- Trust events  
- Storefronts  
- Listings  
- Residuals  

Merchant performance is not a simple metric — it is a lineage‑driven profile that reflects operational truth.

---

2. Merchant Identity (MRC‑XID)

Every merchant has:

- MRC‑XID — identity anchor  
- StorefrontXIDs — one or more  
- ListingXIDs — many  
- ProductXIDs — many  
- SaleXIDs — many  
- TrustEventXIDs — many  

Merchant performance is computed across all these linked objects.

---

3. Merchant Performance Pillars

Merchant performance is built on five pillars:

✅ 3.1 Sales Performance
- Total sales  
- Average order value  
- Conversion rate  
- Repeat buyer rate  
- Listing performance  

✅ 3.2 Financial Performance
- Gross earnings  
- Net earnings  
- Fee impact  
- Credit impact  
- Adjustment impact  

✅ 3.3 Trust Performance
- Dispute rate  
- RMA rate  
- Resolution time  
- Evidence quality  
- Admin escalations  

✅ 3.4 Storefront Performance
- Storefront health  
- Listing quality  
- Shipping reliability  
- Delivery confirmation rate  

✅ 3.5 Residual Impact
- Residuals triggered  
- Residuals earned (if steward‑merchant)  
- Referral lineage strength  

---

4. Merchant Performance Lineage Entry

Each merchant receives a lineage entry per sale:

`
{
  "self": "<SaleXID>",
  "merchant": "<MerchantXID>",
  "storefront": "<StorefrontXID>",
  "listing": "<ListingXID>",
  "gross": <amount>,
  "net": <amount>,
  "fees": {
      "platform": <amount>,
      "credit_card": <amount>,
      "handling": <amount>
  },
  "credits": <amount>,
  "adjustments": <amount>,
  "trust_events": ["<TrustEventXID>", ...],
  "rma": "<RMAXID or null>",
  "credit_cycle": "<CRDXID or null>"
}
`

This is the atomic unit of merchant performance.

---

5. Merchant Performance Panel (Vault Integration)

The Merchant Performance Panel shows:

✅ 5.1 Summary
- Total gross  
- Total net  
- Total fees  
- Total credits  
- Total adjustments  
- Total disputes  
- Total RMAs  

✅ 5.2 Breakdown by Storefront
- Storefront X‑ID  
- Sales  
- Net earnings  
- Dispute rate  
- Delivery reliability  

✅ 5.3 Breakdown by Listing
- Listing X‑ID  
- Conversion rate  
- Sales count  
- Net earnings  
- Dispute rate  

✅ 5.4 Trust Metrics
- Dispute rate  
- RMA rate  
- Resolution time  
- Admin escalations  
- Evidence quality score  

✅ 5.5 Residual Metrics
- Residuals triggered  
- Residuals earned  
- Referral lineage strength  

---

6. Trust Integration

Merchant performance must reference Trust Events when:

- A dispute is opened  
- A dispute is resolved  
- An RMA is approved or rejected  
- A credit is issued  
- An admin override occurs  

Each of these generates:

`
TrustEventXID → MerchantXID
`

---

7. X‑ID Validation Requirements

Merchant performance calculations must validate:

- Merchant X‑ID  
- Storefront X‑ID  
- Listing X‑ID  
- Sale X‑ID  
- Fee X‑IDs  
- Credit X‑IDs  
- RMA X‑IDs  
- TrustEvent X‑IDs  

If any fail validation:

- The entry is flagged  
- The panel displays a lineage warning  
- Adminflow logs a Trust Event  

---

8. Stewardship Notes
- Merchant performance is lineage‑anchored, not recalculated ad hoc  
- Every sale must reference the merchant  
- Every fee must reference the merchant  
- Every trust event must reference the merchant  
- Merchant performance must be immutable except through Trust Events  
- Merchant performance is the foundation of platform trust  

---