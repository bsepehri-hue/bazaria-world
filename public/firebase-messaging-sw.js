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

// 🚀 UBER-STYLE LOCK SCREEN NOTIFICATION EVENT CAPTURE
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message intercept verified: ', payload);

  // Extract variables with strict fallbacks so Chrome never reads an undefined token reference
  const titleText = (payload.notification && payload.notification.title) || '📡 New Broadcast Lead!';
  const bodyText = (payload.notification && payload.notification.body) || 'An asset request is waiting for operational triage.';
  
  // Safely grab the landing route string
  const targetUrl = (payload.data && payload.data.url) ? String(payload.data.url) : '/rewards';

  const notificationOptions = {
    body: bodyText,
    icon: '/icons/icon-192x192.png', 
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200], 
    tag: 'lead-broadcast-alert', // Forces Chrome to stack updates cleanly instead of deadlocking
    data: {
      url: targetUrl
    }
  };

  // Execute the frame directly on the native registration scope
  return self.registration.showNotification(titleText, notificationOptions);
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
