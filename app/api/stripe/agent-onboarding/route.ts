"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider"; // Adjust this import to your actual auth hook

export default function AgentOnboardingButton() {
  const { user } = useAuth(); // Grabbing the active Firebase user
  const [loading, setLoading] = useState(false);

  const handleOnboard = async () => {
    if (!user?.uid) {
      alert("Please log in to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/agent-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentUid: user.uid,
          email: user.email || "",
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect the agent to the secure Stripe portal
        window.location.href = data.url;
      } else if (data.verified) {
        // The API confirmed they are already fully onboarded
        alert("Your account is already verified and active!");
        setLoading(false);
      } else {
        console.error("API Error:", data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to connect to Stripe:", error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleOnboard}
      disabled={loading || !user}
      style={{
        backgroundColor: '#004d40', 
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: 'none',
        cursor: (loading || !user) ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: '0.2s ease-in-out'
      }}
    >
      {loading ? "Syncing Profile..." : "Complete Agent Profile"}
    </button>
  );
}
