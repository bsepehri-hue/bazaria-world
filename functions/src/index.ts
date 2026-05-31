import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export { processNotificationQueue } from "./notifications";

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
    
    // 🎯 FIXED: Safely calculate metrics from the SDK array to prevent runtime crashes
    const totalSuccess = response.responses.filter(r => r.success).length;
    const totalFailure = response.responses.filter(r => !r.success).length;

    console.log(`✅ Multi-tenant lead broadcast successfully finished processing.`);
    console.log(`📈 Results: ${totalSuccess} sent successfully, ${totalFailure} failed.`);

  } catch (error) {
    console.error("❌ Critical background multicast alert processing failure:", error);
  }
});

// 🏆 3. NEW WORKFLOW: MERCHANT AUCTION ACQUISITION CONCLUDED ALERT ENGINE
export const onAuctionConcludedNotification = onDocumentCreated("orders/{orderId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const orderData = snap.data();
  const orderId = event.params.orderId;

  // Verify this order originated from an auction asset transaction block
  const sellerId = orderData.sellerId;
  const assetName = orderData.assetName || "Premium Marketplace Listing Asset";
  const finalPrice = Number(orderData.finalPrice) || 0;
  const listingId = orderData.listingId || "UNKNOWN_XID";

  if (!sellerId) {
    console.warn(`⚠️ Closeout alert bypassed: Order ${orderId} does not possess a target merchant signature.`);
    return;
  }

  console.log(`🏆 Processing automated merchant closeout broadcast for Listing: ${listingId} -> Seller: ${sellerId}`);

 
    // 2️⃣ Assemble the high-priority premium asset sold lock screen configuration
    const notificationPayload = {
      tokens: registrationTokens,
      notification: {
        title: "🏆 ITEM SOLD!",
        body: `Success! "${assetName}" closed at a final price of $${finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      },
      // Meta-data parameters handled natively by public/firebase-messaging-sw.js background channels
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
          color: "#05292e" // Perfectly matches your luxury dark green branding profile
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

    // 3️⃣ Fire the multicast transmission across the active Google Cloud cluster
    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    
    console.log(`✅ Merchant auction closure notification loop completed processing.`);
    console.log(`📈 Metrics: ${response.successCount} fired successfully, ${response.failureCount} deflected.`);

  } catch (error) {
    console.error("❌ Critical fault on merchant fulfillment payload routing:", error);
  }
});

// 🚀 4. NEW WORKFLOW: MERCHANT OPENING BID ACTIVATION ENGINE
export const onOpeningBidNotification = onDocumentCreated("listings/{listingId}/bids/{bidId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const bidData = snap.data();
  const listingId = event.params.listingId;
  const bidAmount = Number(bidData.amount) || 0;

  console.log(`🔍 Evaluating incoming bid for Listing ID: ${listingId} ($${bidAmount})`);

  

    // 2️⃣ Collect the merchant's authenticated hardware registration tokens
    const merchantTokensSnapshot = await db.collection("users").doc(merchantId).collection("fcmTokens").get();

    if (merchantTokensSnapshot.empty) {
      console.warn(`⚠️ Deferred: Merchant ${merchantId} has not armed background notification permissions yet.`);
      return;
    }

    const registrationTokens: string[] = [];
    merchantTokensSnapshot.forEach((docSnap) => {
      if (docSnap.id) {
        registrationTokens.push(docSnap.id);
      }
    });

    if (registrationTokens.length === 0) return;

    // 3️⃣ Construct the unified high-priority payload
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

    // 4️⃣ Execute the multicast payload broadcast across Google's pipeline
    const response = await admin.messaging().sendEachForMulticast(notificationPayload);
    console.log(`✅ Opening bid notification loop completed. Broadcast Success: ${response.successCount}`);

  } catch (error) {
    console.error("❌ Fatal fault within opening bid activation compiler:", error);
  }
});

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already done above in your file
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const processNotificationQueue = functions.firestore
  .document('notification_queue/{notificationId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    if (!data) return;

    const { type, title, body, fallbackUrl, metadata } = data;
    console.log(`🚀 Background worker picked up a [${type}] request. Processing...`);

    
      // 2️⃣ Assemble the high-priority lock screen notification payload
      const notificationPayload = {
        tokens: registrationTokens,
        notification: {
          title: title || "📡 New Marketplace Update",
          body: body || "An action requires your attention.",
        },
        data: {
          url: fallbackUrl || "/rewards",
          ...metadata // Spreads any extra variables like ticketId or listingId safely
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

