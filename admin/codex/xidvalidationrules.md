✅ X‑ID Validation Rules
Integrity Checks • Lineage Verification • System Trust

1. Purpose
To define how ListToBid verifies that every X‑ID in the system is:

- Authentic  
- Untampered  
- Correctly structured  
- Properly linked  
- Lineage‑consistent  

These rules protect the integrity of the Vault, the Cycle Chain, and every panel that depends on X‑ID truth.

---

2. Validation Layers

X‑ID validation happens across five layers, each one deeper than the last:

1. Format Validation  
2. Prefix Validation  
3. Epoch Validation  
4. Hash Validation  
5. Lineage Validation  

Each layer must pass before the next is checked.

---

3. Layer 1 — Format Validation

Every X‑ID must match the canonical structure:

`
<PREFIX>-<EPOCH>-<HASH>
`

✅ Valid if:
- Exactly 3 segments  
- Segments separated by hyphens  
- Epoch is a 13‑digit integer  
- Hash is 8–12 characters  

❌ Invalid if:
- Missing segments  
- Extra segments  
- Wrong separators  
- Epoch not numeric  
- Hash too short or too long  

If format fails, the X‑ID is rejected immediately.

---

4. Layer 2 — Prefix Validation

The prefix must be one of the immutable, approved prefixes defined in the X‑ID Generation Algorithm.

✅ Valid if:
- Prefix is in the approved list  
- Prefix matches the object/event type  

❌ Invalid if:
- Unknown prefix  
- Deprecated prefix  
- Prefix does not match the object type  

This prevents spoofing and misclassification.

---

5. Layer 3 — Epoch Validation

The epoch must be:

- A valid 13‑digit timestamp  
- Not in the future  
- Not before platform launch  
- Within a reasonable range of the parent’s epoch  

✅ Valid if:
- epoch <= now  
- epoch >= platformlaunchepoch  
- epoch >= parent_epoch (if parent exists)  

❌ Invalid if:
- Timestamp is in the future  
- Timestamp is too old  
- Timestamp predates parent  

This ensures temporal lineage integrity.

---

6. Layer 4 — Hash Validation

The hash must be consistent with the inputs used at creation:

`
hash = sha256(prefix|epoch|parent|random).slice(0, 10)
`

✅ Valid if:
- Recomputed hash matches stored hash  
- Parent X‑ID is included in the hash input  
- Hash length is correct  

❌ Invalid if:
- Hash mismatch  
- Parent missing from hash input  
- Hash length incorrect  

This prevents tampering and forgery.

---

7. Layer 5 — Lineage Validation

This is the deepest and most important layer.

✅ Valid if:
- Parent exists  
- Parent is the correct type  
- Parent epoch ≤ child epoch  
- Siblings reference each other  
- Cross‑links reference valid X‑IDs  
- No circular lineage  
- No orphaned lineage  
- No broken chain segments  

❌ Invalid if:
- Parent missing  
- Parent type mismatch  
- Parent created after child  
- Sibling mismatch  
- Cross‑links reference invalid X‑IDs  
- Circular lineage detected  
- Orphaned lineage detected  

This ensures the entire X‑ID network remains coherent.

---

8. Validation Flow (Full Algorithm)

`
function validateXID(xid) {
    if (!validFormat(xid)) return false
    if (!validPrefix(xid)) return false
    if (!validEpoch(xid)) return false
    if (!validHash(xid)) return false
    if (!validLineage(xid)) return false

    return true
}
`

Validation stops at the first failure.

---

9. Validation in the Vault

The Vault uses X‑ID validation to:

- Expand drawers  
- Resolve cross‑panel navigation  
- Verify cycle chains  
- Detect lineage corruption  
- Prevent admin overrides from breaking history  

If an X‑ID fails validation:

- The drawer refuses to open  
- The panel displays a lineage warning  
- Adminflow logs a Trust Event  
- The system requests correction  

---

10. Stewardship Notes
- X‑ID validation protects the entire Codex  
- Validation must run before any drawer expands  
- Validation must run before any admin override  
- Validation must run before any payout  
- Validation must run before any trust resolution  
- Validation must never be bypassed  

This scroll ensures the lineage system remains incorruptible.

---