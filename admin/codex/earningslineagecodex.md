✅ Earnings Lineage Codex
File: earningslineagecodex.md  
Truth • Transparency • Immutable Flow

---

🏛️ 1. Purpose

To define how all financial events on ListToBid are:

- recorded  
- anchored  
- traced  
- reconciled  
- adjusted  
- displayed  
- protected  

Earnings Lineage ensures that every dollar has a parent, a purpose, and a permanent record.

This codex is the economic truth layer of the platform.

---

🔗 2. Earnings Identity (ERXID)

Every financial event generates an EarningsXID (ERXID).

Each ERXID links to:

- SaleXID (the sale)  
- POXID (the purchase order)  
- ListingXID (the item)  
- MerchantXID (the seller)  
- StewardXID (if residuals apply)  
- CycleXID (the operational cycle)  
- PlatformXID (platform fees)  

Earnings lineage is never abstract — it is always tied to real events.

---

🧩 3. Earnings Categories

✅ 3.1 Merchant Earnings
Money earned by the merchant after:

- platform fees  
- residuals  
- credits  
- adjustments  

Merchant earnings anchor to:

- SaleXID  
- DeliveryXID  
- RMAXID (if applicable)  

---

✅ 3.2 Steward Residuals
Residuals earned by stewards for referrals.

Anchored to:

- SaleXID  
- STW‑XID  
- RSXID  

(Defined fully in the Steward Residuals Codex.)

---

✅ 3.3 Platform Fees
ListToBid’s revenue.

- 14% total fee  
- 12% platform  
- 2% steward residual  

Anchored to:

- SaleXID  
- FeeXID  

---

✅ 3.4 Credits & Adjustments
Triggered by:

- RMA  
- partial refunds  
- admin overrides  
- dispute resolutions  

Anchored to:

- RMAXID  
- AdjustmentXID  

---

💰 4. Earnings Flow Formula

For every sale:

`
SaleAmount
│
├── Merchant Earnings = SaleAmount × (1 - 0.14)
├── Steward Residual = SaleAmount × 0.02
└── Platform Fee = SaleAmount × 0.12
`

If RMA occurs:

`
AdjustedEarnings = FinalSaleAmount - Credits - Adjustments
`

All recalculations generate new ERXIDs.

---

🧿 5. Earnings Lineage Entry

`
{
  "erxid": "<EarningsXID>",
  "type": "<merchant | residual | platform | credit | adjustment>",
  "sale": "<SaleXID>",
  "listing": "<ListingXID>",
  "merchant": "<MerchantXID>",
  "steward": "<StewardXID>",
  "amount": <decimal>,
  "timestamp": "<ISO>",
  "parent_cycle": "<CycleXID>",
  "adjustments": ["<AdjustmentXID>", ...],
  "status": "<pending | released | adjusted | removed>"
}
`

Earnings entries are append‑only — never overwritten.

---

📊 6. Earnings Visibility

Earnings appear in:

✅ Merchant Dashboard
- total earnings  
- pending earnings  
- released earnings  
- adjustments  
- credits  
- lineage map  

✅ Steward Dashboard
- residuals  
- pending vs released  
- adjustments  
- lineage map  

✅ Adminflow
- platform revenue  
- fee distribution  
- residual distribution  
- credit volume  
- adjustment volume  
- economic health indicators  

✅ Vault Panels
- Earnings Lineage Panel  
- Platform Health Panel  
- Steward Performance Panel  
- Merchant Performance Panel  

Earnings lineage is the economic transparency layer.

---

⚖️ 7. Reconciliation Rules

- All earnings must anchor to a closed Sale Cycle.  
- No earnings may be released before Delivery Cycle closure.  
- Credits must always generate new ERXIDs.  
- Adjustments must always reference RMAXID.  
- Admin overrides require justification and lineage anchor.  

Reconciliation ensures economic truth.

---

🧬 8. Integration With Other Codices

Earnings Lineage connects to:

- Cycle Chain Codex  
- Steward Residuals Codex  
- Trust Ledger Codex  
- Merchant Performance Codex  
- Steward Performance Codex  
- Platform Health Codex  

This codex is the economic spine of the Vault.

---

🪶 9. Stewardship Notes

- Earnings must always reflect final truth, not temporary states.  
- No manual edits — only lineage‑anchored adjustments.  
- Transparency is mandatory.  
- Earnings lineage is part of the platform’s legacy.  

---