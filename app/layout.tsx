"use client"; // 🚀 Switch layout wrapper to client-context to manage live session memory

import "@/app/globals.css"; 
import { useState, useEffect } from "react";
import { AppProviders } from "./AppProviders";
import { DynamicLayoutWrapper } from "@/components/checkout/DynamicLayoutWrapper";
import ClientSupportChat from "@/components/ui/ClientSupportChat";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTestTicket, setActiveTestTicket] = useState<string>("tkt_gen_825315");

  // 📡 Dynamically keep layout synced with whatever ticket your browser session is testing
  useEffect(() => {
    const checkActiveSession = () => {
      const savedTicket = localStorage.getItem("bazaria_active_ticket");
      if (savedTicket && savedTicket !== activeTestTicket) {
        setActiveTestTicket(savedTicket);
      }
    };

    // Check on initial load
    checkActiveSession();

    // Listen for custom creation triggers from your marketplace components
    window.addEventListener("storage", checkActiveSession);
    window.addEventListener("new-ticket-created", checkActiveSession);
    
    return () => {
      window.removeEventListener("storage", checkActiveSession);
      window.removeEventListener("new-ticket-created", checkActiveSession);
    };
  }, [activeTestTicket]);

  return (
    <html lang="en">
      <body>
        <AppProviders>
          <DynamicLayoutWrapper>
            {children}
          </DynamicLayoutWrapper>

          {/* ⚡ NOW DYNAMICALLY BOUND TO YOUR REAL-TIME SESSIONS */}
          {activeTestTicket && <ClientSupportChat ticketId={activeTestTicket} />}
          
        </AppProviders>
      </body>
    </html>
  );
}
