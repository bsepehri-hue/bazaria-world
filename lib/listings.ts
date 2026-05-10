"use server";

import { db } from "@/lib/firebase/client"; // Next.js safely handles this client instance on the server
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createLineageBlock } from "./utils"; // 🔑 Imports our newly centralized X-ID engine

interface CreateListingInput {
  title: string;
  price: number;
  category: string;
  merchantId: string;    // Identity Parent: MRC-xxxxx
  storefrontId?: string; // Optional Storefront Object: STF-xxxxx
  images?: string[];
  description?: string;
  details?: Record<string, any>;
}

/**
 * 🧬 Spawns a new marketplace asset carrying an immutable X-ID Lineage Block.
 * This guarantees that every product listing is permanently tied to its
 * merchant parent identity from the millisecond of its creation.
 */
export async function createMarketplaceListing(input: CreateListingInput) {
  try {
    const listingsCollection = collection(db, "listings");

    // Enforce our strict naming taxonomy
    const parentMerchantXID = input.merchantId.startsWith("MRC-")
      ? input.merchantId
      : `MRC-${input.merchantId}`;

    const storefrontXID = input.storefrontId
      ? (input.storefrontId.startsWith("STF-") ? input.storefrontId : `STF-${input.storefrontId}`)
      : null;

    // 🧬 Compile the strict Object Lineage Block (Part 2 Compliance)
    // Parent: The Merchant Identity who owns the asset
    // Cross-links: The Storefront Object where the asset is displayed
    const lineageBlock = createLineageBlock({
      type: "PRD",
      parent: parentMerchantXID,
      cross_links: storefrontXID ? [storefrontXID] : [],
    });

    const listingPayload = {
      // 🧬 The immutable X-ID ancestry block
      xid_chain: lineageBlock,

      // Core Asset Properties
      title: input.title,
      price: Number(input.price),
      category: input.category,
      description: input.description || "",
      images: input.images || [],
      details: input.details || {},
      status: "active",
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // 🚀 Write to Firestore using the unique self X-ID as the Document ID
    // This establishes absolute synchrony between your Doc ID and your X-ID.
    const docRef = doc(listingsCollection, lineageBlock.self);
    await setDoc(docRef, listingPayload);

    console.log(`🧬 Structural Lineage Lock: [${lineageBlock.self}] successfully written to database.`);

    return { 
      success: true, 
      listingId: lineageBlock.self,
      productCode: lineageBlock.self.split("-").pop() // e.g., "C78F2"
    };

  } catch (error) {
    console.error("Listing creation aborted due to lineage compilation failure:", error);
    return { success: false, error: (error as Error).message };
  }
}
