import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// 🎟️ 1. EXISTING WORKFLOW: STOREFRONT BADGE TRIGGER ENGINE
export const onSaleCreated = onDocumentCreated("sales/{saleId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const sale = snap.data() as {
    stewardId: string;
    merchantId: string;
    amount: number;
    referralFee?: number;
  };

  // Reference to merchant profile
  const userRef = db.collection("users").doc(sale.merchantId);

  // Flip storefront badge on first sale
  if (sale.amount > 0) {
    await userRef.update({
      "badges.storefront_activated": "emerald",
      "badges.finance_connected": "emerald"
    });
  }

  // Flip referral badge if referral fee present
  if (sale.referralFee && sale.referralFee > 0) {
    await userRef.update({
      "badges.auctionlink_connected": "emerald"
    });
  }
});

// 📡 2. NEW WORKFLOW: UBER-STYLE LEAD DISPATCH NOTIFICATION ENGINE
export const onNewTicketBroadcastPushAlert = onDocumentCreated("support_tickets/{ticketId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const ticketData = snap.data();
  const ticketId = event.params.ticketId;
  
  const productCode = ticketData.product_code || "GENERAL";
  const subjectText = ticketData.subject || "Incoming Marketplace Request";
  const initialMessage = ticketData.message || "A client has initiated a live broadcast triage window.";

  console.log(`📡 Processing live dispatch v2 alert for Ticket: ${ticketId} [Asset Context: ${productCode}]`);

  try {
    // 1️⃣ Grab all mobile device addresses registered by your sales agents
    const agentTokensSnapshot = await db.collection("agent_tokens").get();

    if (agentTokensSnapshot.empty) {
      console.warn("⚠️ No active sales agents have registered their cell phones yet. Skipping notification blast.");
      return;
    }

    // Compile a clean array of device destination addresses
    const registrationTokens: string[] = [];
    agentTokensSnapshot.forEach((docSnap) => {
      const tokenData = docSnap.data();
      if (tokenData && tokenData.deviceToken) {
        registrationTokens.push(tokenData.deviceToken);
      }
    });

    if (registrationTokens.length === 0) {
      console.warn("⚠️ Zero usable device token strings extracted from agent registry arrays.");
      return;
    }

    console.log(`📥 Targets verified. Dispatching to ${registrationTokens.length} active agent device channels...`);

    // 2️⃣ Assemble the high-priority lock screen notification payload configuration
    const notificationPayload = {
      tokens: registrationTokens,
      notification: {
        title: `📡 New Live Broadcast! [${productCode}]`,
        body: `${subjectText}: "${initialMessage.substring(0, 60)}${initialMessage.length > 60 ? "..." : ""}"`,
      },
      // Meta-data parameters parsed directly by your public/firebase-messaging-sw.js background worker
      data: {
        url: `/rewards?ticketId=${ticketId}`,
        ticketId: ticketId,
      },
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          vibrateTimingsMillis: [0, 200, 100, 200], // Physical hardware pulse timing parameters
          color: "#05292e" // Matches your branding layout background color
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            "content-available": 1 // Critical for forcing background worker threads to wake up on iOS
          }
        }
      }
    };

    // 3️⃣ Blast the notifications across the Google Cloud framework via Firebase Cloud Messaging
    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    
    console.log(`✅ Multi-tenant lead broadcast successfully finished processing.`);
    console.log(`📈 Results: ${response.successCount} sent successfully, ${response.failureCount} failed.`);

  } catch (error) {
    console.error("❌ Critical background multicast alert processing failure:", error);
  }
});
