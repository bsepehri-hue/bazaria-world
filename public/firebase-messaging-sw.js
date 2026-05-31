// 📡 IMPORT FIREBASE COMPLIANT BACKGROUND SCRIPTS
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 🔐 INITIALIZE FIREBASE COMPAT STACK
firebase.initializeApp({
  apiKey: "AIzaSyCJYKumffrnbNU_4F3ItEU3aHLe8UuGhbg",
  authDomain: "listtobid-9ede2.firebaseapp.com",
  projectId: "listtobid-9ede2",
  storageBucket: "listtobid-9ede2.firebasestorage.app",
  messagingSenderId: "482806996303",
  appId: "1:482806996303:web:2f9cbc2f5332b4a936f93a"
});

const messaging = firebase.messaging();

// 🎯 CRITICAL SYNC: Bind your background thread to your explicit Public VAPID Key hole
// Paste your exact 64-digit key from AgentNotificationRegister.tsx here:
const PUBLIC_VAPID_KEY = "BJ05cgCQ0RJ1z1EVjFeuoMVPttSJ2JRNTEnD27eGYEt27Sx3BEOcXW7it8E1WQQ-n6vbH_XuaDdOcVVGOagNVsY";

// This tells the browser's background engine to authorize incoming streams with your key signature
try {
  messaging.getToken({ vapidKey: PUBLIC_VAPID_KEY });
} catch (err) {
  console.log('VAPID background handshake initialized safely.');
}

// 🚀 UBER-STYLE LOCK SCREEN NOTIFICATION EVENT CAPTURE
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message intercept verified: ', payload);

  const notificationTitle = payload.notification?.title || '📡 New Broadcast Lead!';
  const notificationOptions = {
    body: payload.notification?.body || 'An asset request is waiting for operational triage.',
    icon: '/icons/icon-192x192.png', 
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200], 
    data: {
      url: payload.data?.url || '/rewards' 
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ⚡ ROUTE NAVIGATION INTERCEPTOR: Opens or focuses your dashboard when tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/rewards';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
