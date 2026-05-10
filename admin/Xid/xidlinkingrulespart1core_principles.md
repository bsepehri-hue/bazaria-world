✅ X‑ID Linking Rules — Part 1: Core Principles

Once this is in place, we’ll move to Parts 2–4 (Object Links, Event Links, Cycle Links, Vault Links).

---

🧬 X‑ID Linking Rules (Part 1 — Core Principles)
Identity Thread • Lineage Binding • Ledger Integrity

1. Purpose
To define how X‑IDs connect across people, events, cycles, fees, and lineage.  
These rules ensure that every operational action in ListToBid is traceable, immutable, and anchored to a single identity thread.

The X‑ID linking system answers the question:  
“How does everything in the economy connect?”

---

2. The Three Linking Layers
Every X‑ID participates in three layers of linkage:

2.1 Vertical Lineage (Parent → Child)
This is the “ancestry” chain.

Examples:  
- Steward X‑ID → Merchant X‑ID  
- Sale X‑ID → Fee X‑ID  
- Cycle X‑ID → Event X‑ID  

Vertical lineage shows origin.

---

2.2 Horizontal Lineage (Siblings in the Same Cycle)
This is the “same moment” chain.

Examples:  
- Sale X‑ID ↔ Shipping X‑ID ↔ RMA X‑ID  
- Fee X‑ID ↔ Residual X‑ID ↔ Platform Net X‑ID  

Horizontal lineage shows context.

---

2.3 Cross‑Lineage (Cross‑Panel Linking)
This is the “cross‑system” chain.

Examples:  
- Referral X‑ID ↔ Earnings Lineage X‑ID  
- Trust Event X‑ID ↔ Cycle X‑ID  
- Steward X‑ID ↔ Residual X‑ID  

Cross‑lineage shows impact.

---

3. The X‑ID Linking Rule Set

Rule 1 — Every object must have exactly one X‑ID
No duplicates.  
No shared IDs.  
No recycled IDs.

Rule 2 — Every event must reference its parent X‑ID
Example:  
A sale event must reference the product X‑ID and the seller X‑ID.

Rule 3 — Every cycle must reference the sale X‑ID
PO → Sale → Shipping → RMA → Credit  
All share the same sale anchor.

Rule 4 — Every fee must reference the cycle X‑ID
Fees are children of cycles, not sales.

Rule 5 — Every residual must reference the steward X‑ID
Residuals are children of stewards.

Rule 6 — Every trust event must reference the event or cycle it affects
Trust is always anchored to something real.

Rule 7 — Every Vault panel must reference the X‑ID chain
This is how the Vault stays unified.

---

4. The X‑ID Chain Format
Every object stores a chain like this:

`
{
  "self": "<XID>",
  "parent": "<XID>",
  "siblings": ["<XID>", "<XID>"],
  "cross_links": ["<XID>", "<XID>"]
}
`

This chain is what allows the Vault to:

- Expand drawers  
- Show lineage  
- Cross‑link between panels  
- Trace earnings  
- Trace referrals  
- Trace trust  
- Trace cycles  
