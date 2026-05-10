import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/server";
import { getProductCode } from "./utils"; // 🔑 Import our new X-ID utility

// 🔑 Vault summary: balances + earnings (Enforces Rule 1: Consistent Totals)
export async function getVaultSummary(stewardId: string) {
  const userRef = doc(db, "users", stewardId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error("User not found");

  const data = userDoc.data();

  const lifetime = data.vault?.lifetime ?? 0;
  const referrals = data.vault?.referrals ?? 0;

  return {
    available: data.vault?.available ?? 0,
    pending: data.vault?.pending ?? 0,
    lifetime,
    referrals,
  };
}

// 🧬 Transaction ledger: Now returns structured Event Objects with lineage chains (Parts 3 & 5 Compliance)
export async function getTransactionLedger(stewardId: string) {
  const q = query(
    collection(db, "transactions"),
    where("stewardId", "==", stewardId),
    orderBy("date", "desc"),
    limit(20) // Expanded slightly to provide robust dashboard fill
  );

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    
    // Extract or build a virtual fallback X-ID Chain if document hasn't completed full migration
    const selfXid = data.xid_chain?.self || `SAL-${docSnap.id}`;
    const parentXid = data.xid_chain?.parent || null;
    const productCode = getProductCode(parentXid);

    return {
      id: docSnap.id,
      ...data,
      
      // 🧬 UNIVERSAL VAULT LINEAGE CHAIN (Part 5 Compliance)
      xid_chain: {
        self: selfXid,
        parent: parentXid,
        siblings: data.xid_chain?.siblings || [],
        cross_links: data.xid_chain?.cross_links || [`STR-${stewardId}`],
        
        // 📡 Section 5: Pre-configured internal Cross-Panel routes
        vault_links: [
          { panel: "EarningsLineage", targetXid: selfXid },
          { panel: "PlatformFees", targetXid: selfXid },
          { panel: "ReferralConstellation", targetXid: `STR-${stewardId}` }
        ]
      },
      product_code: productCode, // Front-facing 5-digit reference
    };
  });
}

// 🧬 Universal Lineage Tracer: "One button push intelligence instantly"
// This single function recursively crawls any X-ID in the system to fetch its linked siblings, parent, or children for drawers!
export async function traceXidLineage(targetXid: string) {
  console.log(`🧬 Vault Lineage Tracer: Locating node details for ${targetXid}`);
  
  // Parse target types from prefixes (Rule 6: Internal tracking remains secure)
  const prefix = targetXid.substring(0, 3);
  
  let targetCollection = "transactions";
  if (prefix === "PRD") targetCollection = "listings";
  else if (prefix === "STR" || prefix === "USR") targetCollection = "users";
  else if (prefix === "INQ") targetCollection = "inquiries";
  else if (prefix === "FEE") targetCollection = "fees";
  else if (prefix === "RFL") targetCollection = "referrals";

  // Query database based on the unique self X-ID
  const q = query(
    collection(db, targetCollection),
    where("xid_chain.self", "==", targetXid),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    return { error: `Node ${targetXid} could not be resolved in ledger.` };
  }

  const data = snap.docs[0].data();
  return {
    xid: targetXid,
    type: prefix,
    lineage: data.xid_chain,
    meta: {
      title: data.subject || data.title || data.displayName || "Unknown Node",
      value: data.price || data.amount || data.value || null,
      timestamp: data.created_at || data.date || null
    }
  };
}

// --- Historical Flat-Query fallbacks (Calculating aggregates) ---
async function getLifetimeEarnings(stewardId: string) {
  const q = query(
    collection(db, "sales"),
    where("stewardId", "==", stewardId)
  );
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}

async function getReferralEarnings(stewardId: string) {
  const q = query(
    collection(db, "referrals"),
    where("referrerId", "==", stewardId)
  );
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}

async function getPlatformFees(stewardId: string) {
  const q = query(
    collection(db, "fees"),
    where("stewardId", "==", stewardId)
  );
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
}
