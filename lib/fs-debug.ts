import { getDocs as originalGetDocs } from "firebase/firestore";

export async function getDocsDebug(query: any) {
  try {
    // Extract the collection path
    const path = query._query?.path?.canonicalString || "UNKNOWN_PATH";
    console.log("🔥 FIRESTORE READ:", path);

    return await originalGetDocs(query);
  } catch (err) {
    console.error("🔥 FIRESTORE ERROR:", err);
    throw err;
  }
}