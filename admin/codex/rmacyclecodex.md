✅ RMA Cycle Codex
File: rmacyclecodex.md  
Restoration • Correction • Integrity

---

🏛️ 1. Purpose

To define the complete lifecycle of an RMA (Return Merchandise Authorization) inside ListToBid:

- how returns begin  
- how evidence is evaluated  
- how responsibility is assigned  
- how items are returned  
- how lineage is updated  
- how trust is recalibrated  

The RMA Cycle is the restorative ritual of the marketplace.

---

🔗 2. RMA Identity (RMA‑XID)

Every return receives a unique RMAXID:

`
RMA‑<XID>
`

This identity links to:

- DeliveryXID  
- ShippingXID  
- SaleXID  
- ListingXID  
- BuyerXID  
- MerchantXID  
- Trust Ledger  
- Discrepancy Engine  

An RMA is a lineage anchor for correction.

---

🧭 3. The Four Stages of the RMA Cycle

The RMA Cycle unfolds in four stages:

1. Initiation  
2. Evaluation  
3. Return Shipment  
4. Resolution

Each stage has its own rules, lineage, and emotional tone.

---

✅ 4. Stage One — Initiation
The buyer requests correction.

Triggered when:

- buyer reports an issue  
- buyer requests a return  
- buyer disputes condition  

Tone:

`
A correction is requested.
`

Rules:

- buyer must select a reason  
- buyer must provide evidence (if required)  
- merchant is notified  
- RMA‑XID is generated  

Initiation is the opening ritual.

---

✅ 5. Stage Two — Evaluation
Truth is examined.

Triggered when:

- merchant reviews evidence  
- system checks listing truth  
- Discrepancy Engine evaluates patterns  

Tone:

`
Truth is weighed with care.
`

Possible outcomes:

- Approved  
- Denied  
- Escalated to Dispute Cycle  

Evaluation is the judgment ritual.

---

✅ 6. Stage Three — Return Shipment
The offering returns to its origin.

Triggered when:

- merchant approves RMA  
- buyer ships item back  
- tracking activates  

Tone:

`
The offering retraces its path.
`

Rules:

- buyer must ship within window  
- tracking must be valid  
- item must be packaged securely  

Return Shipment is the reversal ritual.

---

✅ 7. Stage Four — Resolution
The cycle restores balance.

Triggered when:

- merchant receives item  
- condition is verified  
- refund or correction is issued  

Tone:

`
Balance is restored.
`

Possible outcomes:

- Refund  
- Replacement  
- Partial refund  
- Denial (if condition differs)  

Resolution is the restoration ritual.

---

🧿 8. RMA Cycle Lineage Entry

`
{
  "rma_xid": "<RMAXID>",
  "sale": "<SaleXID>",
  "listing": "<ListingXID>",
  "buyer": "<BuyerXID>",
  "merchant": "<MerchantXID>",
  "reason": "<string>",
  "timestamps": {
    "initiation": "<ISO>",
    "evaluation": "<ISO>",
    "return_shipment": "<ISO>",
    "resolution": "<ISO>"
  },
  "status": "<initiated | approved | denied | returned | resolved>",
  "evidence": ["<ImageXID>", ...],
  "trust_delta": <int>,
  "performance_delta": <int>
}
`

The RMA Cycle is a living lineage object.

---

⚠️ 9. RMA Threats

Threats include:

- buyer fraud  
- merchant denial without cause  
- incorrect item returned  
- damaged return  
- missing components  
- repeated RMA abuse  

Each threat triggers:

- Trust Ledger entries  
- Storefront Health penalties  
- Discrepancy Engine alerts  

---

🔄 10. RMA Recovery Protocols

Recovery occurs through:

- evidence review  
- merchant correction  
- buyer clarification  
- dispute escalation  
- trust restoration  

Ceremonial message:

`
Restoration brings the Codex back into balance.
`

---

🧬 11. Integration With Other Codices

The RMA Cycle connects to:

- Delivery Cycle Codex  
- Sale Cycle Codex  
- Dispute Cycle Codex  
- Trust Ledger Codex  
- Storefront Health Codex  
- Earnings Lineage Codex  
- Discrepancy Engine Codex  

RMA is the corrective engine of the marketplace.

---

🪶 12. Stewardship Notes

- RMAs must feel fair, not punitive.  
- Buyers must feel protected.  
- Merchants must feel respected.  
- Evidence must guide decisions, not emotion.  
- Restoration must feel like closure, not conflict.  

---