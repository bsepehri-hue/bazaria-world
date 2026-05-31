import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Use the existing app initialization safely
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const processNotificationQueue = functions.firestore
  .document('notification_queue/{notificationId}')
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (!data) return;

    const { type, title, body, fallbackUrl, metadata } = data;
    console.log(`🚀 Background worker picked up a [${type}] request. Processing...`);

    let agentTokensSnapshot;
    try {
      agentTokensSnapshot = await db.collection("agent_tokens").get();
    } catch (dbError) {
      console.error("❌ Firestore read error:", dbError);
      return;
    }

    if (!agentTokensSnapshot || agentTokensSnapshot.empty) {
      console.warn("⚠️ No active device tokens found in agent_tokens. Exiting.");
      return;
    }

    const registrationTokens: string[] = [];
    agentTokensSnapshot.forEach((docSnap) => {
      const tokenData = docSnap.data();
      if (tokenData && tokenData.deviceToken) {
        registrationTokens.push(tokenData.deviceToken);
      }
    });

    if (registrationTokens.length === 0) {
      console.warn("⚠️ Zero usable device token strings extracted.");
      return;
    }

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

    try {
      const response = await admin.messaging().sendEachForMulticast(notificationPayload);
      const totalSuccess = response.responses.filter(r => r.success).length;
      const totalFailure = response.responses.filter(r => !r.success).length;
      console.log(`✅ Queue processing complete. Success: ${totalSuccess}, Failed: ${totalFailure}`);
      
      await snapshot.ref.delete();
    } catch (fcmError) {
      console.error("❌ FCM distribution failure:", fcmError);
    }
  });
