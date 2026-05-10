✅ Steward Residuals Codex
File: stewardresidualscodex.md  
Lineage • Influence • Recurring Reward

---

🏛️ 1. Purpose

To define how residual earnings are:

- created  
- calculated  
- anchored  
- distributed  
- adjusted  
- displayed  
- protected  

Residuals are the economic expression of stewardship.  
They reward influence, trust, and network strength — not volume alone.

This codex ensures residuals are fair, traceable, immutable, and lineage‑anchored.

---

🔗 2. Residual Identity (RSXID)

Every residual event generates a ResidualXID (RSXID).

Each RSXID links to:

- STW‑XID (the steward)  
- SaleXID (the sale that generated the residual)  
- ListingXID (the item sold)  
- POXID (the purchase order)  
- CycleXID (the operational cycle)  

Residuals are not abstract — they are anchored to real economic events.

---

🧩 3. Residual Creation Rules

Residuals are created when:

1. A buyer makes a purchase  
2. That buyer was referred by a steward  
3. The sale completes successfully  
4. The Sale Cycle closes without dispute  

Residuals are never created:

- on canceled orders  
- on failed payments  
- on fraudulent activity  
- on unresolved disputes  
- on RMA cycles that end in merchant fault  

Residuals must always reflect true, completed economic activity.

---

💰 4. Residual Calculation

ListToBid’s structure:

- Platform fee: 14%  
- Steward residual: 2%  
- Platform keeps: 12%  

Residual formula:

`
Residual = SaleAmount × 0.02
`

Residuals are calculated at the moment the Sale Cycle closes, but they are not released until the Delivery Cycle closes.

This protects the steward from:

- RMAs  
- disputes  
- fraud  
- cancellations  

Residuals must always reflect finalized truth.

---

🔄 5. Residual Adjustment Rules

Residuals may be adjusted only in these cases:

✅ 5.1 RMA → Merchant Fault
Residual is removed.

✅ 5.2 RMA → Buyer Fault
Residual is kept.

✅ 5.3 Partial Credit
Residual is recalculated based on the final sale amount.

✅ 5.4 Admin Override
Must include justification and lineage anchor.

Residual adjustments generate:

- AdjustmentXID  
- Trust Ledger entry  
- Platform Health update  

Residuals must always match the final economic reality.

---

🧿 6. Residual Lineage Entry

`
{
  "rsxid": "<ResidualXID>",
  "steward": "<StewardXID>",
  "sale": "<SaleXID>",
  "listing": "<ListingXID>",
  "po": "<POXID>",
  "amount": <decimal>,
  "status": "<pending | released | adjusted | removed>",
  "timestamp": "<ISO>",
  "adjustments": ["<AdjustmentXID>", ...],
  "parent_cycle": "<CycleXID>"
}
`

Residuals are never overwritten — only appended with adjustments.

---

📊 7. Residual Visibility

Residuals appear in:

✅ Steward Performance Panel
- total residuals  
- pending residuals  
- released residuals  
- adjusted residuals  
- residual lineage map  

✅ Earnings Lineage Panel
- steward earnings  
- merchant earnings  
- platform fees  
- credits  
- adjustments  

✅ Platform Health Panel
- total residual distribution  
- residual velocity  
- residual stability  

Residuals are part of the economic transparency layer.

---

🧬 8. Integration With Other Codices

Residuals connect to:

- Cycle Chain Codex  
- Trust Ledger Codex  
- Steward Performance Codex  
- Platform Health Codex  
- Earnings Lineage Codex  

Residuals are not isolated — they are woven into the entire Vault.

---

🪶 9. Stewardship Notes

- Residuals reward influence, not manipulation.  
- Residuals must always be lineage‑anchored.  
- Residuals must never be manually edited.  
- Adjustments must always create new lineage entries.  
- Residuals are part of the steward’s legacy inside the platform.  

---
