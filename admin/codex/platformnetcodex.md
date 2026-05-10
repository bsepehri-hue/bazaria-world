✅ Platform Net Codex
This is the scroll that explains the platform’s true earnings — not just fees, not just gross revenue, but the actual net after every lineage‑anchored event has played out.

It ties together:

- Platform fees  
- Credit card fees  
- Handling fees  
- Residual payouts  
- Credits  
- Adjustments  
- Disputes  
- Storefront lineage  
- Cycle chain lineage  
- X‑ID validation  

Below is your Codex‑ready file, clean and ready to drop into admin/codex as:

platformnetcodex.md

---

💠 Platform Net Codex
True Earnings • Fee Lineage • Net Reality

1. Purpose
To define how ListToBid calculates platform net earnings using lineage‑anchored financial events.  
This codex ensures that the platform’s financial truth is:

- Accurate  
- Immutable  
- Traceable  
- X‑ID anchored  
- Vault‑consistent  

Platform net is not a simple subtraction — it is a lineage‑driven financial reconstruction.

---

2. Platform Net Components

Platform net is derived from:

✅ 2.1 Platform Fee (14%)
Attached to the Sale cycle.  
Always references Storefront X‑ID.

✅ 2.2 Credit Card Fee (3%)
Paid by the steward/merchant.  
Does not affect platform net directly.

✅ 2.3 Handling Fee (10% of shipping)
Attached to the Shipping cycle.  
Always references Storefront X‑ID.

✅ 2.4 Residual Payouts (2%)
Paid out when a sale is via referral.  
Reduces platform net.

✅ 2.5 Credits
If the platform is responsible, credits reduce platform net.

✅ 2.6 Adjustments
Admin adjustments may increase or decrease platform net.

✅ 2.7 RMA Fees
If the platform absorbs RMA costs, they reduce platform net.

---

3. Platform Net Formula

For each sale:

`
PlatformNet = PlatformFee
              + HandlingFee
              - ResidualPayouts
              - PlatformCredits
              ± PlatformAdjustments
              - RMAPlatformCosts
`

Notes:
- Credit card fees do not reduce platform net — they reduce merchant/steward net.  
- Residual payouts always reduce platform net.  
- Credits only reduce platform net if the platform is responsible.  

---

4. Platform Net Lineage Entry

Each sale generates a platform net entry:

`
{
  "self": "<SaleXID>",
  "storefront": "<StorefrontXID>",
  "platform_fee": <amount>,
  "handling_fee": <amount>,
  "residual_payouts": <amount>,
  "platform_credits": <amount>,
  "platform_adjustments": <amount>,
  "rmaplatformcosts": <amount>,
  "net": <amount>
}
`

This is the atomic unit of platform net.

---

5. Platform Net Panel (Vault Integration)

The Platform Net Panel shows:

✅ 5.1 Summary
- Total platform fees  
- Total handling fees  
- Total residual payouts  
- Total credits  
- Total adjustments  
- Total RMA costs  
- Total net  

✅ 5.2 Breakdown by Storefront
- Storefront X‑ID  
- Net contribution  
- Fee contribution  
- Residual impact  

✅ 5.3 Breakdown by Cycle
- Sale cycle  
- Shipping cycle  
- RMA cycle  
- Credit cycle  

✅ 5.4 Breakdown by Listing
- Listing X‑ID  
- Product X‑ID  
- Net contribution per listing  

---

6. Trust Integration

Platform net must reference Trust Events when:

- A dispute affects platform earnings  
- A credit is issued  
- An admin override adjusts platform net  
- A fee is corrected  

Each of these generates:

`
TrustEventXID → SaleXID → StorefrontXID
`

---

7. X‑ID Validation Requirements

Platform net calculations must validate:

- Sale X‑ID  
- Storefront X‑ID  
- Fee X‑IDs  
- Residual X‑IDs  
- Credit X‑IDs  
- Adjustment X‑IDs  

If any fail validation:

- The entry is flagged  
- The panel displays a lineage warning  
- Adminflow logs a Trust Event  

---

8. Stewardship Notes
- Platform net is lineage‑anchored, not recalculated ad hoc  
- Every fee must reference the storefront  
- Every residual must reference the sale  
- Every credit must reference the cycle  
- Platform net must be immutable except through Trust Events  
- Platform net is the platform’s financial truth  
