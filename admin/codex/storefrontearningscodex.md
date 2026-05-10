✅ Storefront Earnings Codex
This scroll explains how storefront‑level earnings are calculated, displayed, and tied into the Vault and X‑ID system.  
It’s the missing bridge between:

- Storefront lineage  
- Earnings Lineage Panel  
- Platform Net Panel  
- Steward Residuals Panel  
- Referral Constellation  

Below is your Codex‑ready file, clean and ready to drop into admin/codex as:

storefrontearningscodex.md

---

🏪💰 Storefront Earnings Codex
Storefront Profitability • Lineage Anchors • Fee Mapping

1. Purpose
To define how storefront‑level earnings are calculated, tracked, and displayed across the Vault.  
This codex ensures that every storefront — whether steward‑owned or merchant‑owned — has a clear, lineage‑anchored financial truth.

Storefront earnings are not just numbers.  
They are lineage expressions tied to:

- Sales  
- Fees  
- Residuals  
- Credits  
- Adjustments  
- Trust events  

---

2. Storefront Earnings Identity

Every storefront has:

- STF‑XID — identity anchor  
- Earnings lineage — derived from Sale cycles  
- Fee lineage — derived from Platform Fees & Cycles  
- Residual lineage — derived from Referral Constellation  

Storefront earnings are always tied to:

`
SaleXID → StorefrontXID → MerchantXID → StewardXID (if applicable)
`

This ensures multi‑layer traceability.

---

3. Earnings Components

Storefront earnings consist of:

✅ 3.1 Gross Sale Amount
The full price paid by the buyer.

✅ 3.2 Platform Fee (14%)
Always attached to the Sale cycle.  
Always references Storefront X‑ID.

✅ 3.3 Credit Card Fee (3%)
Paid by the steward/merchant.  
Always references Storefront X‑ID.

✅ 3.4 Handling Fee (10% of shipping)
Attached to the Shipping cycle.  
Always references Storefront X‑ID.

✅ 3.5 Residual Payouts (2%)
If the sale was via referral.  
Always references Storefront X‑ID.

✅ 3.6 Credits / Adjustments
From RMA or admin actions.  
Always references Storefront X‑ID.

---

4. Storefront Net Earnings Formula

The storefront’s net earnings for a sale:

`
Net = Gross Sale 
      - Platform Fee (14%) 
      - Credit Card Fee (3%) 
      - Shipping Cost 
      - Handling Fee (10% of shipping)
      - Credits (if any)
      + Adjustments (if any)
`

Notes:
- Residual payouts do not reduce storefront earnings — they reduce platform net.  
- Credits reduce storefront earnings only if the merchant/steward is responsible.  
- Adjustments may increase or decrease earnings depending on admin action.

---

5. Storefront Earnings Lineage

Every sale pushes a lineage entry into the storefront:

`
{
  "self": "<SaleXID>",
  "storefront": "<StorefrontXID>",
  "gross": <amount>,
  "fees": {
      "platform": <amount>,
      "credit_card": <amount>,
      "handling": <amount>
  },
  "shipping_cost": <amount>,
  "credits": <amount>,
  "adjustments": <amount>,
  "net": <amount>
}
`

This is the atomic unit of storefront earnings.

---

6. Storefront Earnings Panel (Vault Integration)

The Storefront Earnings Panel (implicitly part of the Earnings Lineage Panel) shows:

✅ 6.1 Summary
- Total gross  
- Total fees  
- Total credits  
- Total adjustments  
- Total net  

✅ 6.2 Breakdown by Cycle
- Sale cycle  
- Shipping cycle  
- RMA cycle  
- Credit cycle  

✅ 6.3 Breakdown by Listing
- Listing X‑ID  
- Product X‑ID  
- Sale count  
- Net earnings per listing  

✅ 6.4 Breakdown by Steward (if steward‑owned)
- Residuals earned  
- Residuals triggered  
- Referral lineage  

---

7. Storefront → Vault Panel Integration

Earnings Lineage Panel
Shows storefront‑level earnings per sale.

Platform Fees & Cycles Panel
Shows storefront‑level fee contributions.

Steward Residuals Panel
Shows residuals triggered by storefront sales.

Referral Constellation Panel
Shows how storefront sales propagate network earnings.

Platform Net Panel
Uses storefront earnings to compute platform net.

---

8. Trust Integration

Storefront earnings must reference Trust Events when:

- A dispute affects earnings  
- An admin override adjusts earnings  
- A credit is issued  
- A fee is corrected  

Each of these generates:

`
TrustEventXID → StorefrontXID
`

---

9. Stewardship Notes
- Storefront earnings are lineage‑anchored, not recalculated ad hoc  
- Every fee must reference the storefront  
- Every credit must reference the storefront  
- Every adjustment must reference the storefront  
- Storefront earnings must be immutable except through Trust Events  
- Storefront earnings must be visible across multiple Vault panels  
