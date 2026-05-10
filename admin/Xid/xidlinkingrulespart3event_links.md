🧬 X‑ID Linking Rules (Part 3 — Event Links)
Event Identity • Operational Lineage • Immutable Flow

1. Purpose
To define how X‑IDs connect across all events in the ListToBid ecosystem.  
Events are actions that occur over time — they create motion, lineage, and traceability.

This section answers:  
“How do actions connect to each other and to the objects they affect?”

---

2. Event Categories

2.1 Commerce Events
- Sale  
- Shipping  
- Delivery confirmation  
- RMA  
- Credit issuance  

2.2 Financial Events
- Platform fee creation  
- Credit card fee creation  
- Handling fee creation  
- Residual payout  
- Platform net entry  

2.3 Trust Events
- Confirmation  
- Dispute  
- Resolution  
- Steward action  
- Admin override  

2.4 Referral Events
- Referral creation  
- Referral activation  
- Residual trigger  

Each event receives its own X‑ID.

---

3. Event Linking Rules

Rule 1 — Every event must reference its parent object
Examples:

- Sale → Product X‑ID  
- Shipping → Sale X‑ID  
- RMA → Sale X‑ID  
- Residual → Steward X‑ID  
- Trust event → Event or cycle X‑ID  

This ensures every event is anchored to something real.

---

Rule 2 — Events in the same cycle must reference each other as siblings
Example (Sale Cycle):

`
Sale X‑ID
Shipping X‑ID
RMA X‑ID
Credit X‑ID
`

These form a horizontal lineage.

---

Rule 3 — Financial events must reference the cycle event they belong to
Example:

- Platform fee → Sale X‑ID  
- Credit card fee → Sale X‑ID  
- Handling fee → Shipping X‑ID  
- Residual payout → Sale X‑ID  

This ensures fees are tied to the correct operational moment.

---

Rule 4 — Trust events must reference the event they affect
Examples:

- Dispute → Sale X‑ID  
- Resolution → Dispute X‑ID  
- Confirmation → Shipping X‑ID  

This creates a trust chain.

---

Rule 5 — Referral events must reference both the steward and the merchant
Example:

`
ReferralEvent.parent = StewardXID
ReferralEvent.cross_links = [MerchantXID]
`

This allows the Referral Constellation to map lineage.

---

4. Event Lineage Chain Format

Every event stores a chain:

`
{
  "self": "<XID>",
  "parent": "<ObjectXID>",
  "siblings": ["<EventXID>", "<EventXID>"],
  "cross_links": ["<XID>", "<XID>"]
}
`

Parent
The object that the event belongs to.

Siblings
Events in the same operational cycle.

Cross‑links
Events or objects affected by this event.

---

5. Examples

Example 1 — Sale Event
`
Sale.self = SAL-epoch-hash
Sale.parent = PRD-epoch-hash
Sale.siblings = [ShippingXID, RMAXID, CreditXID]
Sale.cross_links = [PlatformFeeXID, ResidualXID]
`

---

Example 2 — Trust Event
`
Dispute.self = TRU-epoch-hash
Dispute.parent = SAL-epoch-hash
Dispute.siblings = []
Dispute.cross_links = [ResolutionXID]
`

---

Example 3 — Referral Event
`
Referral.self = RFL-epoch-hash
Referral.parent = StewardXID
Referral.cross_links = [MerchantXID]
`

---

6. Stewardship Notes
- Event links must never be altered  
- Sibling links must remain intact  
- Trust events must always reference the event they affect  
- Referral events must always reference both sides  
- Event lineage is the heartbeat of the Vault  

---
