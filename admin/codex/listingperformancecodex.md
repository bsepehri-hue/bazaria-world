✅ 1. Listing Performance Codex
Codex‑ready file: listingperformancecodex.md

🧾 Listing Performance Codex
Conversion • Quality • Lineage Anchors

1. Purpose
To define how ListToBid measures listing performance using lineage‑anchored data from:

- Views  
- Clicks  
- Conversions  
- Sales  
- Fees  
- Credits  
- RMAs  
- Trust events  
- Storefront health  

Listings are not static objects — they are living lineage nodes whose performance shapes merchant success, steward earnings, and platform health.

---

2. Listing Identity (LST‑XID)

Each listing has:

- LST‑XID — identity anchor  
- Parent: Storefront X‑ID  
- Cross‑links: Product, Merchant, Steward, Sale cycles  

Listing performance is computed across all linked cycles.

---

3. Listing Performance Pillars

✅ 3.1 Visibility Performance
- Impressions  
- Click‑through rate  
- Search ranking  
- Storefront placement  

✅ 3.2 Conversion Performance
- Add‑to‑cart rate  
- Purchase conversion rate  
- Repeat buyer rate  

✅ 3.3 Financial Performance
- Gross earnings  
- Net earnings  
- Fee impact  
- Credit impact  

✅ 3.4 Trust Performance
- Dispute rate  
- RMA rate  
- Evidence quality  
- Resolution outcomes  

✅ 3.5 Lifecycle Performance
- Listing age  
- Update frequency  
- Price changes  
- Seasonal patterns  

---

4. Listing Performance Lineage Entry

`
{
  "self": "<ListingXID>",
  "storefront": "<StorefrontXID>",
  "product": "<ProductXID>",
  "merchant": "<MerchantXID>",
  "views": <int>,
  "clicks": <int>,
  "conversions": <int>,
  "sales": ["<SaleXID>", ...],
  "gross": <amount>,
  "net": <amount>,
  "fees": {...},
  "credits": <amount>,
  "rmas": ["<RMAXID>", ...],
  "trust_events": ["<TrustEventXID>", ...]
}
`

---

5. Vault Integration

- Earnings Lineage Panel → listing‑level earnings  
- Platform Fees & Cycles Panel → fee impact  
- Trust Ledger Panel → disputes & RMAs  
- Merchant Performance Panel → listing contribution  
- Storefront Health Panel → listing quality  

---

6. Stewardship Notes
- Listing performance is lineage‑anchored  
- Every sale must reference the listing  
- Every trust event must reference the listing  
- Listing performance must be immutable except through Trust Events  

---

✅ Listing Performance Codex complete.
