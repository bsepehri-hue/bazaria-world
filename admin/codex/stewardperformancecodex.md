🌿 Steward Performance Codex
Residuals • Network Strength • Storefront Impact

1. Purpose
To define how ListToBid measures steward performance using lineage‑anchored data from:

- Residuals  
- Referrals  
- Storefronts  
- Sales  
- Trust events  
- Credits  
- Adjustments  
- Network growth  

Steward performance is not a simple metric — it is a lineage‑driven profile that reflects influence, reliability, and economic contribution.

---

2. Steward Identity (STR‑XID)

Every steward has:

- STR‑XID — identity anchor  
- StorefrontXIDs — one or more  
- ReferralXIDs — many  
- ResidualXIDs — many  
- SaleXIDs — indirectly (via storefronts)  
- TrustEventXIDs — many  

Steward performance is computed across all these linked objects.

---

3. Steward Performance Pillars

Steward performance is built on five pillars:

✅ 3.1 Network Performance
- Total referrals  
- Active referrals  
- Referral conversion rate  
- Referral retention rate  
- Network depth (1st, 2nd, 3rd level)  

✅ 3.2 Residual Performance
- Total residuals earned  
- Residuals per storefront  
- Residuals per merchant  
- Residuals per listing  
- Residuals per sale  

✅ 3.3 Storefront Performance
- Storefront health  
- Listing quality  
- Sales volume  
- Net earnings  
- Dispute rate  

✅ 3.4 Trust Performance
- Dispute involvement  
- RMA involvement  
- Admin escalations  
- Evidence quality (if steward is seller)  

✅ 3.5 Platform Contribution
- Total platform fees generated  
- Total net contribution  
- Network‑wide economic impact  

---

4. Steward Performance Lineage Entry

Each sale that triggers a residual creates a lineage entry:

`
{
  "self": "<ResidualXID>",
  "steward": "<StewardXID>",
  "sale": "<SaleXID>",
  "storefront": "<StorefrontXID>",
  "listing": "<ListingXID>",
  "residual_amount": <amount>,
  "referral_source": "<ReferralXID>",
  "trust_events": ["<TrustEventXID>", ...],
  "adjustments": <amount>
}
`

This is the atomic unit of steward performance.

---

5. Steward Performance Panel (Vault Integration)

The Steward Performance Panel shows:

✅ 5.1 Summary
- Total residuals earned  
- Total referrals  
- Active referrals  
- Network depth  
- Storefront count  
- Total platform contribution  

✅ 5.2 Breakdown by Storefront
- Storefront X‑ID  
- Sales volume  
- Net earnings  
- Residuals generated  
- Dispute rate  

✅ 5.3 Breakdown by Referral
- Referral X‑ID  
- Conversion rate  
- Lifetime value  
- Residuals generated  

✅ 5.4 Network Metrics
- First‑level referrals  
- Second‑level referrals  
- Third‑level referrals  
- Network health score  

✅ 5.5 Trust Metrics
- Dispute involvement  
- RMA involvement  
- Admin escalations  
- Evidence quality  

---

6. Trust Integration

Steward performance must reference Trust Events when:

- A dispute involves a steward  
- A credit affects a steward’s residual  
- An admin override adjusts residuals  
- A referral is corrected  
- A storefront is corrected  

Each of these generates:

`
TrustEventXID → StewardXID
`

---

7. X‑ID Validation Requirements

Steward performance calculations must validate:

- Steward X‑ID  
- Storefront X‑ID  
- Referral X‑ID  
- Residual X‑ID  
- Sale X‑ID  
- Listing X‑ID  
- TrustEvent X‑ID  

If any fail validation:

- The entry is flagged  
- The panel displays a lineage warning  
- Adminflow logs a Trust Event  

---

8. Stewardship Notes
- Steward performance is lineage‑anchored, not recalculated ad hoc  
- Every residual must reference the steward  
- Every referral must reference the steward  
- Every trust event must reference the steward  
- Steward performance must be immutable except through Trust Events  
- Steward performance is the backbone of the Underdog Economy  

---