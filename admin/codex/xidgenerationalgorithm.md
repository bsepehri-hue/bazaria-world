✅ X‑ID Generation Algorithm
How an X‑ID Is Born • Identity Encoding • Immutable Creation

This is the missing technical backbone of your identity system.  
You already defined how X‑IDs link — now we define how they come into existence.

Below is your Codex‑ready file, clean, elegant, and ready to drop into admin/codex as:

xidgenerationalgorithm.md

---

🧬 X‑ID Generation Algorithm
Identity Birth • Prefix Logic • Epoch Encoding

1. Purpose
To define the exact process by which every X‑ID in ListToBid is created.  
This ensures:

- Consistency  
- Traceability  
- Collision‑resistance  
- Immutable lineage  
- Cross‑panel integrity  

This scroll explains how an X‑ID is born, from prefix to hash.

---

2. X‑ID Structure

Every X‑ID follows the same structure:

`
<PREFIX>-<EPOCH>-<HASH>
`

Where:

- PREFIX = object or event type  
- EPOCH = timestamp in milliseconds  
- HASH = short, collision‑resistant digest  

This gives each X‑ID:

- Human readability  
- Machine uniqueness  
- Temporal ordering  
- Lineage clarity  

---

3. Prefix Rules

Each category uses a fixed, immutable prefix:

Identity Objects
- STR — Steward  
- MRC — Merchant  
- USR — Buyer  
- ADM — Admin  

Commerce Objects
- PRD — Product  
- LST — Listing  
- STF — Storefront  

Financial Objects
- PAY — Payment Method  
- PYA — Payout Account  
- TAX — Tax Profile  

Events
- SAL — Sale  
- SHP — Shipping  
- RMA — RMA  
- CRD — Credit  
- PO — Purchase Order  

Trust Events
- TRU — Trust Event  
- DSP — Dispute  
- RSV — Resolution  

Referral Events
- RFL — Referral  
- RSD — Residual  

These prefixes never change.

---

4. Epoch Encoding

The epoch is stored in milliseconds to guarantee:

- Temporal ordering  
- Collision prevention  
- Cross‑system consistency  

Format:

`
Date.now() → 13‑digit integer
`

Example:

`
1732567890123
`

This ensures that even if two events occur in the same second, their X‑IDs remain unique.

---

5. Hash Generation

The hash is a short, collision‑resistant digest generated from:

- Prefix  
- Epoch  
- Parent X‑ID (if any)  
- Random salt  

Hash Input Format
`
<PREFIX>|<EPOCH>|<PARENT>|<RANDOM>
`

Hash Output
- 8–12 characters  
- Base36 or hex  
- Lowercase  

Example:

`
a9f3c21b
`

This keeps X‑IDs compact but unique.

---

6. Parent Assignment

If the object or event has a parent, it must be included at creation time.

Examples:

- Product → parent = Merchant X‑ID  
- Sale → parent = Product X‑ID  
- Shipping → parent = Sale X‑ID  
- Credit → parent = RMA X‑ID  

If no parent exists (e.g., a steward), parent = null.

---

7. Cross‑Link Initialization

Cross‑links are empty at birth.

`
cross_links = []
`

They are added later as the object or event interacts with the system.

This prevents premature or incorrect lineage.

---

8. Full X‑ID Creation Algorithm

Here is the complete process:

`
function generateXID(prefix, parentXID = null) {
    const epoch = Date.now()
    const random = crypto.randomBytes(4).toString('hex')
    const input = ${prefix}|${epoch}|${parentXID}|${random}
    const hash = sha256(input).slice(0, 10)

    return ${prefix}-${epoch}-${hash}
}
`

This ensures:

- Uniqueness  
- Traceability  
- Deterministic structure  
- Immutable lineage  

---

9. Example X‑ID Births

Steward
`
STR-1732567890123-a9f3c21bde
`

Product
`
PRD-1732567900456-b1c8d92f10
`

Sale
`
SAL-1732567910789-cc4e1b9a22
`

Credit
`
CRD-1732567920123-ff19a3c4b1
`

---

10. Stewardship Notes
- Prefixes must never change  
- Epoch must always be in milliseconds  
- Hash must always include parent X‑ID  
- Cross‑links must start empty  
- X‑IDs must never be regenerated or overwritten  
- X‑IDs must never be exposed publicly  

This algorithm is the birth ritual of identity in ListToBid.
