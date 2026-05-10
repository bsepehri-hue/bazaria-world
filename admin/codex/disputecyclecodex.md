✅ Dispute Cycle Codex
File: disputecyclecodex.md  
Truth • Evidence • Resolution

---

🏛️ 1. Purpose

To define the complete lifecycle of a dispute inside ListToBid:

- how disagreements are raised  
- how evidence is evaluated  
- how responsibility is assigned  
- how outcomes are determined  
- how trust is recalibrated  
- how lineage is updated  

The Dispute Cycle is the truth‑seeking ritual of the marketplace.

---

⚖️ 2. Dispute Identity (DSP‑XID)

Every dispute receives a unique DisputeXID:

`
DSP‑<XID>
`

This identity links to:

- DeliveryXID  
- RMAXID (if applicable)  
- SaleXID  
- ListingXID  
- BuyerXID  
- MerchantXID  
- Trust Ledger  
- Discrepancy Engine  

A dispute is a lineage anchor for truth.

---

🧭 3. The Four Stages of the Dispute Cycle

The Dispute Cycle unfolds in four stages:

1. Initiation  
2. Evidence Gathering  
3. Evaluation  
4. Resolution

Each stage has its own rules, lineage, and emotional tone.

---

✅ 4. Stage One — Initiation
The disagreement is formally declared.

Triggered when:

- buyer disputes condition  
- buyer disputes authenticity  
- merchant disputes buyer claim  
- RMA evaluation escalates  

Tone:

`
A claim is made. Truth is requested.
`

Rules:

- DisputeXID is generated  
- both parties notified  
- reason must be selected  
- initial evidence required  

Initiation is the opening of the truth ritual.

---

✅ 5. Stage Two — Evidence Gathering
Truth is documented.

Triggered when:

- buyer uploads evidence  
- merchant uploads evidence  
- system retrieves lineage context  
- Discrepancy Engine analyzes patterns  

Tone:

`
Truth is revealed through clarity.
`

Evidence types:

- photos  
- videos  
- messages  
- listing history  
- shipping scans  
- condition lineage  
- RMA lineage  

Evidence Gathering is the illumination ritual.

---

✅ 6. Stage Three — Evaluation
Truth is weighed.

Triggered when:

- evidence is complete  
- system evaluates patterns  
- trust history is considered  
- listing truth is compared  

Tone:

`
Truth is weighed with fairness and care.
`

Evaluation factors:

- listing accuracy  
- condition truth  
- shipping reliability  
- buyer history  
- merchant history  
- pattern detection  
- evidence quality  

Possible outcomes:

- Buyer Favored  
- Merchant Favored  
- Split Responsibility  
- Escalation (rare)  

Evaluation is the judgment ritual.

---

✅ 7. Stage Four — Resolution
The cycle restores balance.

Triggered when:

- decision is made  
- refund or correction issued  
- trust deltas applied  
- lineage updated  

Tone:

`
Balance returns to the Codex.
`

Possible resolutions:

- full refund  
- partial refund  
- replacement  
- denial  
- trust adjustment  
- performance adjustment  

Resolution is the restoration ritual.

---

🧿 8. Dispute Cycle Lineage Entry

`
{
  "dispute_xid": "<DisputeXID>",
  "sale": "<SaleXID>",
  "listing": "<ListingXID>",
  "buyer": "<BuyerXID>",
  "merchant": "<MerchantXID>",
  "reason": "<string>",
  "timestamps": {
    "initiation": "<ISO>",
    "evidence": "<ISO>",
    "evaluation": "<ISO>",
    "resolution": "<ISO>"
  },
  "status": "<initiated | evidence | evaluating | resolved>",
  "decision": "<buyer | merchant | split>",
  "trustdeltabuyer": <int>,
  "trustdeltamerchant": <int>,
  "performance_delta": <int>,
  "evidence": ["<ImageXID>", ...]
}
`

The Dispute Cycle is a living lineage object.

---

⚠️ 9. Dispute Threats

Threats include:

- false claims  
- deceptive evidence  
- misrepresented condition  
- counterfeit goods  
- repeated dispute abuse  
- merchant negligence  
- buyer manipulation  

Each threat triggers:

- Trust Ledger entries  
- Storefront Health penalties  
- Discrepancy Engine alerts  

---

🔄 10. Dispute Recovery Protocols

Recovery occurs through:

- evidence correction  
- communication  
- trust restoration  
- RMA completion  
- merchant remediation  
- buyer clarification  

Ceremonial message:

`
Truth restores the Codex.
`

---

🧬 11. Integration With Other Codices

The Dispute Cycle connects to:

- RMA Cycle Codex  
- Delivery Cycle Codex  
- Sale Cycle Codex  
- Trust Ledger Codex  
- Storefront Health Codex  
- Earnings Lineage Codex  
- Discrepancy Engine Codex  

Disputes are the truth engine of the marketplace.

---

🪶 12. Stewardship Notes

- Disputes must feel fair, not biased.  
- Evidence must guide decisions, not emotion.  
- Buyers must feel protected.  
- Merchants must feel respected.  
- Truth must feel earned, not assumed.  

---