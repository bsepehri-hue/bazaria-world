⚠️ X‑ID Error States & Recovery Rules
Detection • Correction • Immutable Recovery

1. Purpose
To define how ListToBid detects, classifies, and recovers from X‑ID‑related errors without ever breaking lineage or overwriting history.

This scroll ensures:

- The Vault never opens a corrupted drawer  
- Adminflow never performs an unsafe action  
- Lineage never becomes inconsistent  
- Recovery is always additive, never destructive  

---

2. Error State Categories

There are five classes of X‑ID errors:

1. Format Errors  
2. Prefix Errors  
3. Epoch Errors  
4. Hash Errors  
5. Lineage Errors

Each class has its own detection and recovery rules.

---

3. Format Errors

Definition
The X‑ID does not match the required structure:

`
<PREFIX>-<EPOCH>-<HASH>
`

Examples
- Missing segments  
- Wrong separators  
- Epoch not numeric  
- Hash too short  

Detection
- Regex mismatch  
- Segment count mismatch  

Recovery
`
Create TrustEventXID: "FormatErrorDetected"
Mark X‑ID as invalid
Prevent drawer expansion
Request regeneration from source system
`

No auto‑fix is allowed.

---

4. Prefix Errors

Definition
The prefix is unknown, deprecated, or mismatched with the object type.

Examples
- XYZ-...  
- SAL prefix used for a storefront  
- Deprecated prefix used after migration  

Detection
- Prefix not in approved list  
- Prefix does not match object type  

Recovery
`
Create TrustEventXID: "PrefixErrorDetected"
Flag object for admin review
Adminflow creates a correction entry (not a replacement)
`

Prefix errors require human correction.

---

5. Epoch Errors

Definition
The epoch is invalid, impossible, or violates lineage order.

Examples
- Epoch in the future  
- Epoch before platform launch  
- Child epoch < parent epoch  

Detection
- Timestamp comparison  
- Parent/child ordering check  

Recovery
`
Create TrustEventXID: "EpochErrorDetected"
Adminflow issues an EpochCorrectionXID
Original X‑ID remains untouched
Corrected epoch stored as lineage metadata
`

Epochs are never overwritten — corrections are appended.

---

6. Hash Errors

Definition
The hash does not match the recomputed hash from:

`
prefix|epoch|parent|random
`

Examples
- Tampering  
- Corrupted data  
- Missing parent in hash input  

Detection
- Recompute hash  
- Compare with stored hash  

Recovery
`
Create TrustEventXID: "HashMismatchDetected"
Mark X‑ID as compromised
Generate ReplacementXID (new X‑ID)
Link old X‑ID → new X‑ID via lineage
`

The original X‑ID is preserved for audit.

---

7. Lineage Errors

Definition
The X‑ID’s parent, siblings, or cross‑links violate lineage rules.

Examples
- Missing parent  
- Wrong parent type  
- Circular lineage  
- Orphaned lineage  
- Broken cycle chain  

Detection
- Full lineage traversal  
- Cycle chain validation  
- Cross‑link validation  

Recovery
`
Create TrustEventXID: "LineageErrorDetected"
Adminflow issues LineageCorrectionXID
Missing links are added
Incorrect links are deprecated (not removed)
Circular links are broken by adding a correction entry
`

Lineage is always corrected by addition, never deletion.

---

8. Error State Severity Levels

Level 1 — Minor
- Format issues  
- Prefix mismatches  

Level 2 — Moderate
- Epoch inconsistencies  
- Missing cross‑links  

Level 3 — Severe
- Hash mismatches  
- Broken cycle chain  

Level 4 — Critical
- Circular lineage  
- Orphaned Sale or Credit cycles  
- Parent X‑ID missing entirely  

Critical errors trigger:

- Vault lockdown for that drawer  
- Adminflow escalation  
- SystemEventXID  

---

9. Recovery Chain Format

Every recovery action creates:

`
{
  "self": "<RecoveryXID>",
  "error": "<ErrorType>",
  "original": "<OriginalXID>",
  "correction": "<CorrectionData>",
  "admin": "<AdminXID>",
  "trust_event": "<TrustEventXID>",
  "notes": "<Optional>"
}
`

This ensures full transparency.

---

10. Stewardship Notes
- Errors must never be silently corrected  
- No X‑ID is ever overwritten  
- All corrections must be lineage‑anchored  
- Recovery must always be additive  
- The Vault must refuse to open corrupted drawers  
- Adminflow must log every correction as a Trust Event  

---

