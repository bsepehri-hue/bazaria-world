🧬 X‑ID Linking Rules (Part 2 — Object Links)
Object Identity • Structural Lineage • Immutable Anchors

1. Purpose
To define how X‑IDs are assigned to and linked between all objects in the ListToBid ecosystem.  
Objects are the entities that exist independently of events or cycles.

This section answers:  
“How do identity‑level objects connect to each other?”

---

2. Object Categories
Every object in the system falls into one of these categories:

2.1 Identity Objects
- Stewards  
- Merchants  
- Buyers  
- Admins  

2.2 Commerce Objects
- Products  
- Listings  
- Storefronts  

2.3 Financial Objects
- Payment instruments  
- Payout accounts  
- Tax profiles  

2.4 System Objects
- Roles  
- Permissions  
- Storefront settings  

Each receives its own X‑ID.

---

3. Object Linking Rules

Rule 1 — Every object has a unique X‑ID
No object shares an X‑ID with any other object.  
This is the foundation of identity integrity.

---

Rule 2 — Identity objects are parents to commerce objects
Examples:

- Steward X‑ID → Storefront X‑ID  
- Merchant X‑ID → Listing X‑ID  
- Merchant X‑ID → Product X‑ID  

This establishes ownership lineage.

---

Rule 3 — Commerce objects are parents to event objects
Examples:

- Product X‑ID → Sale X‑ID  
- Listing X‑ID → Sale X‑ID  

This ensures every sale is anchored to a real object.

---

Rule 4 — Storefronts inherit the X‑ID of their owner as parent
A storefront is always linked to the steward or merchant who created it.

`
Storefront.parent = StewardXID
`

This allows the Vault to trace:

- Storefront earnings  
- Storefront lineage  
- Storefront trust events  

---

Rule 5 — Payment instruments link to identity objects
Examples:

- Buyer X‑ID → Payment Method X‑ID  
- Merchant X‑ID → Payout Account X‑ID  

This ensures financial lineage is always tied to a real person.

---

Rule 6 — Roles and permissions link to identity objects
Roles are not free‑floating.  
They are children of the identity they belong to.

`
Role.parent = UserXID
Permission.parent = RoleXID
`

This allows the system to trace:

- Steward actions  
- Admin overrides  
- Merchant operations  

---

4. Object Lineage Chain Format
Every object stores a lineage chain:

`
{
  "self": "<XID>",
  "parent": "<XID or null>",
  "children": ["<XID>", "<XID>"],
  "cross_links": ["<XID>", "<XID>"]
}
`

Parent
Identity or ownership source.

Children
Objects created by this object.

Cross‑links
Non‑hierarchical relationships (e.g., storefront ↔ payout account).

---

5. Examples

Example 1 — Steward → Storefront → Listing → Product
`
STR-epoch-hash
  └── STF-epoch-hash
        └── LST-epoch-hash
              └── PRD-epoch-hash
`

Example 2 — Merchant → Product → Sale
`
MRC-epoch-hash
  └── PRD-epoch-hash
        └── SAL-epoch-hash
`

Example 3 — Buyer → Payment Method
`
USR-epoch-hash
  └── PAY-epoch-hash
`

---

6. Stewardship Notes
- Object links must never be altered after creation  
- Parent links are immutable  
- Cross‑links may be added but never removed  
- Object lineage is the backbone of the Vault’s clarity  

