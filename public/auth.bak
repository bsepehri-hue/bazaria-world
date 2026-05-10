// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAksQw5v8HWB55g5qzaaoG81lf_11g",
  authDomain: "oakportal-57694.firebaseapp.com",
  projectId: "oakportal-57694",
  storageBucket: "oakportal-57694.appspot.com",
  messagingSenderId: "1021687825",
  appId: "1:1021687825:web:b8d63b6a62e3a7f39e"
};

// Initialize once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
// Handle Google One Tap response
function handleCredentialResponse(response) {
  const credential = GoogleAuthProvider.credential(response.credential);
  signInWithCredential(auth, credential)
    .then((result) => {
      const user = result.user;
      document.getElementById("login-section").style.display = "none";
      document.getElementById("dashboard-section").style.display = "block";
      document.getElementById("user-email").textContent = user.email;
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
    });
}

// Email/password login
document.getElementById("login-button").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      const user = result.user;
      document.getElementById("login-section").style.display = "none";
      document.getElementById("dashboard-section").style.display = "block";
      document.getElementById("user-email").textContent = user.email;
    })
    .catch((error) => {
      document.getElementById("login-error").textContent = "Login failed. Please check your credentials.";
      console.error("Email login error:", error);
    });
});

// Listing form logic
document.getElementById("create-listing-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("listing-title").value;
  const description = document.getElementById("listing-description").value;
  const category = document.getElementById("listing-category").value;
  const echo = document.getElementById("listing-echo").value;
  const glyph = getGlyph(category);
  const timestamp = new Date().toLocaleString();

  const scroll = `
    🪶 Steward: ${auth.currentUser.email}
    ✏️ Echo: ${echo}
    🕰️ Timestamp: ${timestamp}
    🔮 Constellation Glyph: ${glyph}
  `;

  document.getElementById("blessing-scroll").textContent = scroll;
});

// Glyph logic
function getGlyph(category) {
  switch (category.toLowerCase()) {
    case "art": return "🎨";
    case "tech": return "💻";
    case "clothing": return "👕";
    case "books": return "📚";
    default: return "✨";
  }
}

// Google One Tap + Button setup
window.onload = () => {
  const buttonDiv = document.getElementById("buttonDiv");
  const loginBtn = document.getElementById("google-login");
alert("GIS initialized");

  // One Tap
  if (google.accounts?.id) {
    google.accounts.id.initialize({
      client_id: "102420516875-fd1k2fl0g5gd2gkt5oenbh5lcov6db4o.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });

    if (buttonDiv) {
      buttonDiv.innerHTML = "";
      google.accounts.id.renderButton(buttonDiv, {
        theme: "outline",
        size: "large"
      });
      google.accounts.id.prompt();
    } else {
      console.warn("One Tap buttonDiv not found.");
    }
  }

  // Manual Google login button
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          document.getElementById("login-section").style.display = "none";
          document.getElementById("dashboard-section").style.display = "block";
          document.getElementById("user-email").textContent = user.email;
        })
        .catch((error) => {
          console.error("Popup login error:", error);
        });
    });
  }
};

// ... your existing Auth.js logic above ...

let lastData = {};

db.collection("stewards").doc(user.uid).onSnapshot((doc) => {
  if (!doc.exists) return;
  const data = doc.data();
  let totalsChanged = false;

  function updateFlow(id, newValue, label) {
    const el = document.getElementById(id);
    if (!el) return;
    const newText = `${label} $${newValue}`;
    if (lastData[id] !== newValue) {
      el.textContent = newText;
      triggerShimmer(id);
      lastData[id] = newValue;
      totalsChanged = true;
    }
  }

  updateFlow("steward-flow", data.stewardCredits || 0, "🪙 Steward Flow (5%) ..........");
  updateFlow("seller-flow", data.sellerCredits || 0, "🔑 Seller Unlock (2%) .........");
  updateFlow("buyer-flow", data.buyerCredits || 0, "🛒 Buyer Ripple (2%) ..........");
  updateFlow("platform-flow", data.platformCredits || 0, "⚖️ Commission (14%) ...........");
  updateFlow("handling-flow", data.handlingFee || 0, "⚖️ Handling Fee (10% shipping)");

  if (totalsChanged) {
  const totalEl = document.querySelector(".totals strong");
  if (totalEl) {
    totalEl.classList.add("pulse");
    totalEl.addEventListener("animationend", () => {
      totalEl.classList.remove("pulse");
    }, { once: true });
  
  }
});
function triggerShimmer(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.add("shimmer");
  el.addEventListener("animationend", () => {
    el.classList.remove("shimmer");
  }, { once: true });
}
function triggerHammerEcho() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="hammer-ripple"></div>
    <div class="hammer-echo">The Hammer has spoken.</div>
  `);
}
