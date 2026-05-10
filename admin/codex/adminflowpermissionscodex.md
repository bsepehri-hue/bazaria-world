🛡️ Adminflow Permissions Codex
Roles • Authority • Lineage Constraints

1. Purpose
To define the permission structure of Adminflow — the internal administrative interface of ListToBid — and to ensure that every action taken by an admin is:

- Authorized  
- Logged  
- Lineage‑anchored  
- Non‑destructive  
- Traceable through X‑ID  

This codex prevents unauthorized overrides, protects the Vault, and ensures the platform’s integrity.

---

2. Permission Philosophy

Adminflow permissions follow three principles:

2.1 Least Authority
Admins only receive the minimum permissions required for their role.

2.2 Lineage Overwrites Nothing
Admins cannot delete or overwrite lineage — they can only append to it.

2.3 Every Action Creates a Trust Event
No admin action is silent.  
Every action generates a Trust Event X‑ID.

---

3. Admin Roles

Adminflow defines four core roles:

3.1 Support Admin
The frontline steward of disputes and user issues.

Can:
- View all panels  
- Add Trust Events  
- Approve/deny RMAs  
- Issue credits  
- Request evidence  
- Add notes  
- Escalate disputes  

Cannot:
- Modify listings  
- Modify storefronts  
- Modify merchant profiles  
- Adjust fees  
- Change system settings  

---

3.2 Merchant Admin
The steward of merchant operations.

Can:
- Modify merchant profiles  
- Modify storefront settings  
- Modify listings  
- Add or remove products  
- Correct listing errors  
- Trigger shipping overrides  

Cannot:
- Issue credits  
- Resolve disputes  
- Adjust fees  
- Modify platform settings  

---

3.3 Finance Admin
The steward of platform‑level financial truth.

Can:
- Adjust fees  
- Correct fee misassignments  
- Trigger payout recalculations  
- Issue platform adjustments  
- Modify tax profiles  
- View Platform Net Panel  
- View Ledger Anchors Panel  

Cannot:
- Modify listings  
- Modify storefronts  
- Resolve disputes  
- Modify merchant profiles  

---

3.4 System Admin
The highest authority — guardian of the platform.

Can:
- Modify admin roles  
- Modify permissions  
- Trigger system‑wide overrides  
- Approve migrations  
- Approve deployments  
- Modify platform settings  
- Access System Events Panel  

Cannot:
- Delete lineage  
- Delete X‑IDs  
- Remove Trust Events  
- Remove cycles  

Even the highest authority cannot break lineage.

---

4. Permission Anchoring (X‑ID Rules)

Every admin action must include:

`
admin: <AdminXID>
role: <RoleXID>
permission: <PermissionXID>
trust_event: <TrustEventXID>
`

This ensures:

- Accountability  
- Traceability  
- Immutable history  

---

5. Permission Enforcement Rules

Rule 1 — No Silent Actions
Every admin action must generate a Trust Event X‑ID.

Rule 2 — No Deletions
Admins cannot delete:

- X‑IDs  
- Cycles  
- Fees  
- Trust events  
- Residuals  
- Storefronts  
- Listings  

Rule 3 — No Retroactive Changes
Admins cannot modify:

- Epochs  
- Hashes  
- Parent X‑IDs  
- Sibling sets  

Rule 4 — Overrides Must Be Logged
Any override must include:

- Reason  
- Admin X‑ID  
- Timestamp  
- Trust Event X‑ID  

Rule 5 — Permissions Must Be Immutable
Role permissions cannot be changed without:

- System Admin approval  
- A System Event X‑ID  

---

6. Permission Lineage Chain Format

Every admin action stores:

`
{
  "self": "<TrustEventXID>",
  "admin": "<AdminXID>",
  "role": "<RoleXID>",
  "permission": "<PermissionXID>",
  "parent": "<ObjectOrEventXID>",
  "cross_links": ["<CycleXID>", "<SaleXID>", "<StorefrontXID>"],
  "action": "<ActionType>",
  "notes": "<Optional>"
}
`

This creates a complete lineage record.

---

7. Stewardship Notes
- Permissions protect the Vault  
- No admin can break lineage  
- Every action must be traceable  
- System Admin is powerful but not destructive  
- Trust Events are the backbone of accountability  
- Adminflow is a governance system, not a control panel  
