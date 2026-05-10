import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/client"; // Next.js safely handles this client instance on the server
import { doc, getDoc, collection, writeBatch, serverTimestamp } from "firebase/firestore";
import { generateXid } from "@/lib/utils"; // 🧬 Import our centralized X-ID engine

export async function POST(request: Request) {
  try {
    const { inquiryId, agentId, setupCode } = await request.json();

    if (!inquiryId || !agentId) {
      return NextResponse.json({ success: false, error: "Missing required parameters." }, { status: 400 });
    }

    const inquiryRef = doc(db, "inquiries", inquiryId);
    const inquirySnap = await getDoc(inquiryRef);

    if (!inquirySnap.exists()) {
      return NextResponse.json({ success: false, error: "Target inquiry not found." }, { status: 404 });
    }

    const inquiryData = inquirySnap.data();

    if (inquiryData.status !== "pending_agent") {
      return NextResponse.json({ success: false, error: "This lead has already been claimed by another agent." }, { status: 400 });
    }

    const batch = writeBatch(db);

    // 🧬 1. EXTRACT EXISTING LINEAGE DATA
    const inquiryXID = inquiryData.xid_chain?.self || `INQ-${inquiryId}`;
    const parentProductXID = inquiryData.xid_chain?.parent || null;
    const customerUid = inquiryData.customer_id;

    // Generate unique structural IDs for our sibling events (Part 3 Compliance)
    const chatXID = generateXid("CHV");
    const claimEventXID = generateXid("FEE"); // Financial/Reward Event Group

    // 🧬 2. CREATE CHAT SIBLING EVENT (Part 3, Rule 2: Horizontal Cycle Siblings)
    const chatDocRef = doc(collection(db, "chats"));
    const chatData = {
      xid_chain: {
        self: chatXID,
        parent: parentProductXID, // Parent points back to the identical product target
        siblings: [inquiryXID, claimEventXID], // Sibling events in the initial transaction cycle
        cross_links: [`STR-${agentId}`, `USR-${customerUid}`] // Connect Steward and User identity anchors
      },
      participants: [agentId, customerUid],
      lastMessage: "System: Listing Agent has accepted the deal and claimed this session.",
      unreadBy: [customerUid],
      status: "active_bridge",
      createdAt: serverTimestamp()
    };
    batch.set(chatDocRef, chatData);

    // 🧬 3. CREATE CLAIM METRIC LOG (Steward Payout Alignment - Part 3, Rule 3)
    const claimDocRef = doc(collection(db, "events"));
    const claimData = {
      xid_chain: {
        self: claimEventXID,
        parent: `STR-${agentId}`, // Parent is the Steward (Listing Agent) identity
        siblings: [inquiryXID, chatXID],
        cross_links: [parentProductXID || ""]
      },
      type: "lead_claim",
      steward_id: agentId,
      setup_code: setupCode || `BAZ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      commission_split_rate: 0.50, // 50/50 platform split
      createdAt: serverTimestamp()
    };
    batch.set(claimDocRef, claimData);

    // 🧬 4. UPDATE ORIGINAL INQUIRY WITH SIBLING INFORMATION (Maintains DNA integrity)
    batch.update(inquiryRef, {
      status: "claimed",
      agent_id: agentId,
      "xid_chain.siblings": [chatXID, claimEventXID], // Wire siblings back!
      lastUpdated: serverTimestamp()
    });

    // 🧬 5. SEED INITIAL MESSAGE
    const msgDocRef = doc(collection(db, `chats/${chatDocRef.id}/messages`));
    batch.set(msgDocRef, {
      senderId: agentId,
      senderName: "Listing Agent",
      text: `Greetings! I am your assigned Listing Agent. I noticed you had an inquiry regarding ${inquiryData.subject.replace(/ \[[^\]]*\]/g, "")}. How can I assist you today?`,
      createdAt: serverTimestamp()
    });

    // Execute the unified transaction batch
    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: "Lead successfully claimed. Lineage links updated.",
      chatId: chatDocRef.id
    });

  } catch (error) {
    console.error("Failed to claim lead transaction:", error);
    return NextResponse.json({ success: false, error: "Internal server claiming error." }, { status: 500 });
  }
}
