import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize the Admin SDK once at the root
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// 🎟️ 1. WORKFLOW: STOREFRONT BADGE TRIGGER ENGINE
export const onSaleCreated = onDocumentCreated("sales/{saleId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const sale = snap.data() as {
    stewardId: string;
    merchantId: string;
    amount: number;
    referralFee?: number;
  };

  const userRef = db.collection("users").doc(sale.merchantId);

  if (sale.amount > 0) {
    await userRef.update({
      "badges.storefront_activated": "emerald",
      "badges.finance_connected": "emerald"
    });
  }

  if (sale.referralFee && sale.referralFee > 0) {
    await userRef.update({
      "badges.auctionlink_connected": "emerald"
    });
  }
});

// 📡 2. WORKFLOW: TICKET DISPATCH NOTIFICATION ENGINE
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
    // Grab all registered sales agent device tokens
    const agentTokensSnapshot = await db.collection("agent_tokens").get();
    if (agentTokensSnapshot.empty) {
      console.warn("⚠️ No active sales agents registered yet. Skipping ticket blast.");
      return;
    }

    const registrationTokens: string[] = [];
    agentTokensSnapshot.forEach((docSnap) => {
      const tokenData = docSnap.data();
      if (tokenData && tokenData.deviceToken) {
        registrationTokens.push(tokenData.deviceToken);
      }
    });

    if (registrationTokens.length === 0) return;

    const notificationPayload = {
      tokens: registrationTokens,
      notification: {
        title: `📡 New Live Broadcast! [${productCode}]`,
        body: `${subjectText}: "${initialMessage.substring(0, 60)}${initialMessage.length > 60 ? "..." : ""}"`,
      },
      data: {
        url: `/rewards?ticketId=${ticketId}`,
        ticketId: ticketId,
      },
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          vibrateTimingsMillis: [0, 200, 100, 200],
          color: "#05292e"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            "content-available": 1
          }
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    const totalSuccess = response.responses.filter(r => r.success).length;
    const totalFailure = response.responses.filter(r => !r.success).length;

    console.log(`✅ Multi-tenant lead broadcast finished. Success: ${totalSuccess}, Failed: ${totalFailure}`);
  } catch (error) {
    console.error("❌ Critical background multicast alert processing failure:", error);
  }
});

// 🏆 3. WORKFLOW: MERCHANT AUCTION ACQUISITION CONCLUDED ALERT ENGINE
export const onAuctionConcludedNotification = onDocumentCreated("orders/{orderId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const orderData = snap.data();
  const orderId = event.params.orderId;

  const sellerId = orderData.sellerId;
  const assetName = orderData.assetName || "Premium Marketplace Listing Asset";
  const finalPrice = Number(orderData.finalPrice) || 0;
  const listingId = orderData.listingId || "UNKNOWN_XID";

  if (!sellerId) {
    console.warn(`⚠️ Closeout alert bypassed: Order ${orderId} missing merchant signature.`);
    return;
  }

  console.log(`🏆 Processing automated merchant closeout broadcast for Listing: ${listingId} -> Seller: ${sellerId}`);

  try {
    // Fetch target merchant's devices
    const merchantTokensSnapshot = await db.collection("users").doc(sellerId).collection("fcmTokens").get();
    if (merchantTokensSnapshot.empty) {
      console.warn(`⚠️ Merchant ${sellerId} has no registered fcmTokens.`);
      return;
    }

    const registrationTokens: string[] = [];
    merchantTokensSnapshot.forEach((docSnap) => {
      if (docSnap.id) {
        registrationTokens.push(docSnap.id);
      }
    });

    if (registrationTokens.length === 0) return;

    const notificationPayload = {
      tokens: registrationTokens,
      notification: {
        title: "🏆 ITEM SOLD!",
        body: `Success! "${assetName}" closed at a final price of $${finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      },
      data: {
        url: `/dashboard/orders/${orderId}`,
        orderId: orderId,
        listingId: listingId
      },
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          vibrateTimingsMillis: [0, 150, 100, 150],
          color: "#05292e"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            "content-available": 1
          }
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    const totalSuccess = response.responses.filter(r => r.success).length;
    const totalFailure = response.responses.filter(r => !r.success).length;

    console.log(`✅ Merchant auction closure notification loop finished. Success: ${totalSuccess}, Failed: ${totalFailure}`);
  } catch (error) {
    console.error("❌ Critical fault on merchant fulfillment payload routing:", error);
  }
});

// 🚀 4. WORKFLOW: MERCHANT OPENING BID ACTIVATION ENGINE
export const onOpeningBidNotification = onDocumentCreated("listings/{listingId}/bids/{bidId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const bidData = snap.data();
  const listingId = event.params.listingId;
  const bidAmount = Number(bidData.amount) || 0;

  console.log(`🔍 Evaluating incoming bid for Listing ID: ${listingId} ($${bidAmount})`);

  try {
    // Fetch listing data to identify the target merchant seller
    const listingSnap = await db.collection("listings").doc(listingId).get();
    const listingData = listingSnap.data();
    if (!listingData || !listingData.sellerId) return;

    const merchantId = listingData.sellerId;
    const assetName = listingData.title || "Marketplace Item";

    const merchantTokensSnapshot = await db.collection("users").doc(merchantId).collection("fcmTokens").get();
    if (merchantTokensSnapshot.empty) {
      console.warn(`⚠️ Merchant ${merchantId} has not armed notification permissions yet.`);
      return;
    }

    const registrationTokens: string[] = [];
    merchantTokensSnapshot.forEach((docSnap) => {
      if (docSnap.id) {
        registrationTokens.push(docSnap.id);
      }
    });

    if (registrationTokens.length === 0) return;

    const notificationPayload = {
      tokens: registrationTokens,
      notification: {
        title: "🚀 Auction Active!",
        body: `Your listing for "${assetName}" has received its opening bid of $${bidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}!`,
      },
      data: {
        url: `/dashboard?tab=inventory`,
        listingId: listingId,
      },
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          vibrateTimingsMillis: [0, 100, 50, 100],
          color: "#05292e"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            "content-available": 1
          }
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    const totalSuccess = response.responses.filter(r => r.success).length;
    const totalFailure = response.responses.filter(r => !r.success).length;

    console.log(`✅ Opening bid notification loop completed. Success: ${totalSuccess}, Failed: ${totalFailure}`);
  } catch (error) {
    console.error("❌ Fatal fault within opening bid activation engine:", error);
  }
});

// ⏳ 5. NEW WORKFLOW: ASYNCHRONOUS DECOUPLED NOTIFICATION QUEUE TASK WORKER
export const processNotificationQueue = onDocumentCreated('notification_queue/{notificationId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  
  const data = snap.data();
  if (!data) return;

  const { type, title, body, fallbackUrl, metadata } = data;
  console.log(`🚀 Background worker picked up a [${type}] request. Processing Queue...`);

  try {
    const agentTokensSnapshot = await db.collection("agent_tokens").get();
    if (agentTokensSnapshot.empty) {
      console.warn("⚠️ No active device tokens found in agent_tokens. Exiting Queue.");
      return;
    }

    const registrationTokens: string[] = [];
    agentTokensSnapshot.forEach((docSnap) => {
      const tokenData = docSnap.data();
      if (tokenData && tokenData.deviceToken) {
        registrationTokens.push(tokenData.deviceToken);
      }
    });

    if (registrationTokens.length === 0) return;

    const notificationPayload = {
      tokens: registrationTokens,
      notification: {
        title: title || "📡 New Marketplace Update",
        body: body || "An action requires your attention.",
      },
      data: {
        url: fallbackUrl || "/rewards",
        ...metadata 
      },
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          vibrateTimingsMillis: [0, 200, 100, 200],
          color: "#05292e"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            "content-available": 1
          }
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    const totalSuccess = response.responses.filter(r => r.success).length;
    const totalFailure = response.responses.filter(r => !r.success).length;
    console.log(`✅ Queue processing complete. Success: ${totalSuccess}, Failed: ${totalFailure}`);
    
    // Clear the log item so your Firestore collection stays clean and fast
    await snap.ref.delete();
  } catch (fcmError) {
    console.error("❌ FCM database queue distribution failure:", fcmError);
  }
});
