🧬 X‑ID Linking Rules (Part 5 — Vault Panel Links)
Vault Integration • Cross‑Panel Lineage • Unified Chamber

1. Purpose
To define how X‑IDs connect across the five foundational Vault panels, ensuring that every panel can reference, expand, and cross‑link into the others.

This section answers:  
“How does the Vault behave as one unified system?”

---

2. The Five Panels

1. Earnings Lineage Panel  
2. Referral Constellation Panel  
3. Trust Ledger Panel  
4. Platform Fees & Cycles Panel  
5. Steward Residuals Panel

Each panel displays a different dimension of the same underlying X‑ID network.

---

3. Vault Linking Rules

Rule 1 — Every panel must reference the X‑ID chain of the object or event it displays
This ensures consistency across the chamber.

Example:  
A sale shown in Earnings Lineage must reference the same Sale X‑ID shown in Platform Fees & Cycles.

---

Rule 2 — Panels must cross‑link to each other using X‑IDs
Examples:

- Earnings Lineage ↔ Referral Constellation  
- Earnings Lineage ↔ Platform Fees & Cycles  
- Trust Ledger ↔ Sale Cycle  
- Steward Residuals ↔ Referral Constellation  

This creates a web of lineage, not isolated views.

---

Rule 3 — Panels must never duplicate data
They reference the same X‑ID, not separate copies.

This prevents drift and ensures truth.

---

Rule 4 — Panels must use X‑ID to expand drawers
When a user taps a sale, steward, or event:

- The panel expands  
- The system fetches the X‑ID chain  
- The drawer reveals linked objects, events, cycles, fees, or trust entries  

This is how the Vault feels alive.

---

Rule 5 — Panels must use X‑ID to resolve cross‑panel navigation
Examples:

- Tapping a steward in Earnings Lineage opens their node in Referral Constellation  
- Tapping a sale in Referral Constellation opens its drawer in Earnings Lineage  
- Tapping a dispute in Trust Ledger opens the linked sale in Platform Fees & Cycles  
- Tapping a merchant in Steward Residuals opens their lineage in Referral Constellation  

This is the Vault’s internal navigation system.

---

Rule 6 — Panels must never expose raw X‑IDs publicly
X‑IDs are internal lineage anchors, not public identifiers.

The Vault is the only place where they are visible.

---

Rule 7 — Panels must maintain immutable lineage
Once an X‑ID is linked:

- It cannot be removed  
- It cannot be reassigned  
- It cannot be overwritten  

This preserves the integrity of the Codex.

---

4. Cross‑Panel Link Map

Earnings Lineage Panel
Links to:
- Referral Constellation (via steward X‑ID)  
- Platform Fees & Cycles (via sale X‑ID)  
- Trust Ledger (via dispute X‑ID)  

---

Referral Constellation Panel
Links to:
- Steward Residuals (via steward X‑ID)  
- Earnings Lineage (via sale X‑ID)  

---

Trust Ledger Panel
Links to:
- Platform Fees & Cycles (via cycle X‑ID)  
- Earnings Lineage (via sale X‑ID)  

---

Platform Fees & Cycles Panel
Links to:
- Earnings Lineage (via sale X‑ID)  
- Trust Ledger (via trust event X‑ID)  

---

Steward Residuals Panel
Links to:
- Referral Constellation (via steward X‑ID)  
- Earnings Lineage (via sale X‑ID)  

---

5. Vault Lineage Chain Format

Every panel entry stores:

`
{
  "self": "<XID>",
  "parent": "<XID>",
  "siblings": ["<XID>", "<XID>"],
  "cross_links": ["<XID>", "<XID>"],
  "vault_links": ["<PanelName>", "<PanelName>"]
}
`

This is the final layer that makes the Vault a unified chamber.

---

6. Stewardship Notes
- The Vault is not a dashboard  
- It is a lineage chamber  
- X‑ID is the thread that binds every panel  
- Cross‑panel linking is the ritual that makes the chamber whole  
- No panel stands alone  

