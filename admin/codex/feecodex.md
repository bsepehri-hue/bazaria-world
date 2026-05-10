✅ Fee Codex
File: feecodex.md_  
Equity • Sustainability • Transparency

---

🏛️ 1. Purpose

To define the fee architecture of ListToBid:

- how platform fees are structured  
- how steward residuals are calculated  
- how merchant costs are determined  
- how transparency is maintained  
- how the treasury grows sustainably  

The Fee Codex is the economic backbone of the marketplace.

---

💠 2. The Fee Principle

Fees must be:

- simple  
- transparent  
- fair  
- predictable  
- sustainable  

No hidden charges.  
No surprise deductions.  
No complexity that erodes trust.

---

🧮 3. Core Fee Structure

ListToBid uses a flat 14% fee on all sales.

This 14% splits into:

- 3% → Credit card processing  
- 2% → Steward residual (if referred)  
- 9% → Platform earnings  
  - operations  
  - treasury  
  - growth  
  - support  
  - infrastructure  

If no steward referral exists:

- the 2% residual simply stays with the platform.

This keeps the system simple, fair, and scalable.

---

🧩 4. Fee Breakdown Lineage Entry

Every sale generates a fee lineage object:

`
{
  "fee_xid": "<FeeXID>",
  "sale": "<SaleXID>",
  "gross": <decimal>,
  "processing_fee": 0.03 * gross,
  "steward_residual": 0.02 * gross,
  "platform_fee": 0.09 * gross,
  "nettomerchant": gross - (processingfee + stewardresidual + platform_fee),
  "timestamp": "<ISO>"
}
`

Fees are lineage‑anchored, not ephemeral.

---

🧬 5. Fee Transparency Rules

The Fee Codex mandates:

- fees must be visible before purchase  
- fees must be visible before listing  
- fees must be visible in the Sale Cycle  
- fees must be visible in the Earnings Lineage  
- fees must be visible in the Steward Dashboard  

No hidden layers.  
No buried details.

---

🧿 6. Fee Integrity Protocols

To maintain fairness:

- fees cannot change mid‑transaction  
- fees cannot be retroactively altered  
- fee disputes must be lineage‑based  
- fee corrections must be transparent  

Integrity is non‑negotiable.

---

🪙 7. Treasury Allocation

Platform fees (9%) flow into:

- Treasury Reserve (stability)  
- Growth Fund (expansion)  
- Support Fund (customer care)  
- Infrastructure Fund (servers, scaling)  

The treasury is the heart of sustainability.

---

🔄 8. Fee Threats

Threats include:

- miscalculated fees  
- incorrect residuals  
- processing errors  
- merchant disputes  
- steward abuse  
- lineage inconsistencies  

Each threat triggers:

- Discrepancy Engine  
- Trust Ledger  
- Treasury Correction Protocol  

---

🧘 9. Stewardship Notes

- Fees must feel fair, not extractive.  
- Residuals must feel earned, not arbitrary.  
- Merchants must feel respected, not drained.  
- The platform must feel sustainable, not greedy.  

The Fee Codex is the moral center of the economy.

---

✅ Fee Codex is complete and sealed.

---
