🗺️ Adminflow Lineage Map
Internal Stewardship • System Authority • Lineage Integration

1. Purpose
To define how the Adminflow (the internal administrative interface of ListToBid) interacts with:

- X‑IDs  
- Cycles  
- Trust events  
- Fees  
- Residuals  
- Storefronts  
- Vault panels  

This scroll ensures that every admin action is:

- Traceable  
- Anchored  
- Logged  
- Reversible only through lineage  
- Connected to the Vault  

Adminflow is not a control panel — it is a lineage‑aware authority layer.

---

2. Admin Identity & X‑ID Anchoring

Every admin has:

- An ADM‑XID  
- A Role X‑ID  
- A Permission X‑ID  

Adminflow Rule 1
Every admin action must reference the Admin X‑ID that performed it.

Adminflow Rule 2
Every admin action must generate a Trust Event X‑ID.

Adminflow Rule 3
Admin actions must never overwrite lineage — they must append lineage.

---

3. Adminflow → X‑ID Integration

Adminflow interacts with X‑ID in three ways:

3.1 Creation
Admins can create:

- Storefronts  
- Listings  
- Products  
- Merchant accounts  
- Steward accounts  

Each creation triggers:

- A new X‑ID  
- A parent assignment  
- A Trust Event X‑ID (“Admin Created Object”)  

---

3.2 Modification
Admins can modify:

- Listings  
- Storefront settings  
- Product details  
- Merchant profiles  

Each modification triggers:

- A Trust Event X‑ID (“Admin Modified Object”)  
- A cross‑link to the modified object  

---

3.3 Resolution
Admins can resolve:

- Disputes  
- RMAs  
- Credits  
- Fraud flags  
- Trust escalations  

Each resolution triggers:

- A Trust Event X‑ID (“Admin Resolution”)  
- A cross‑link to the Sale X‑ID  
- A cross‑link to the RMA or Dispute X‑ID  

---

4. Adminflow → Cycle Chain Integration

Adminflow interacts with the Cycle Chain at specific points:

4.1 PO Cycle
Admins can:
- View  
- Cancel (with Trust Event)  

4.2 Sale Cycle
Admins can:
- View  
- Reauthorize  
- Reverse (with Trust Event)  

4.3 Shipping Cycle
Admins can:
- Override delivery confirmation  
- Add tracking  
- Correct tracking  
- Trigger handling fee adjustments  

4.4 RMA Cycle
Admins can:
- Approve  
- Reject  
- Escalate  
- Request evidence  
- Add notes  

4.5 Credit Cycle
Admins can:
- Issue full credit  
- Issue partial credit  
- Reverse credit  
- Add platform adjustments  

Every action generates:

- A Trust Event X‑ID  
- A cross‑link to the cycle  

---

5. Adminflow → Vault Panel Integration

Adminflow is deeply tied to the Vault.

5.1 Earnings Lineage Panel
Admins can:
- View full breakdown  
- Add platform adjustments  
- Correct fee entries (via Trust Event)  

5.2 Referral Constellation Panel
Admins can:
- View steward lineage  
- Correct referral assignments (via Trust Event)  

5.3 Trust Ledger Panel
Admins can:
- Add notes  
- Add evidence  
- Resolve disputes  
- Override decisions  

5.4 Platform Fees & Cycles Panel
Admins can:
- View all cycles  
- Correct fee misassignments  
- Trigger cycle recalculations  

5.5 Steward Residuals Panel
Admins can:
- View steward earnings  
- Correct residual entries (via Trust Event)  

---

6. Adminflow Event Types

Every admin action generates one of the following Trust Event X‑IDs:

- TRU-... — General trust event  
- DSP-... — Dispute  
- RSV-... — Resolution  
- ADM-CRT-... — Admin created object  
- ADM-MOD-... — Admin modified object  
- ADM-OVR-... — Admin override  
- ADM-ADJ-... — Admin adjustment  

These events appear in:

- Trust Ledger  
- Earnings Lineage  
- Platform Fees & Cycles  
- Referral Constellation (if steward‑related)  
- Steward Residuals (if payout‑related)  

---

7. Adminflow Lineage Chain Format

Every admin action stores:

`
{
  "self": "<TrustEventXID>",
  "admin": "<AdminXID>",
  "parent": "<ObjectOrEventXID>",
  "cross_links": ["<CycleXID>", "<SaleXID>", "<RMAXID>"],
  "action": "<ActionType>",
  "notes": "<Optional>"
}
`

This ensures:

- Traceability  
- Accountability  
- Immutable history  

---

8. Stewardship Notes
- Adminflow is a lineage authority, not a control panel  
- Every admin action must create a Trust Event  
- Admins cannot delete or overwrite lineage  
- Adminflow must always reference the same X‑IDs as the Vault  
- Adminflow actions must be visible in the Trust Ledger  
