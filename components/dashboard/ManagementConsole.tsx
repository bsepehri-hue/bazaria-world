"use client";

import React, { useState } from "react";
import { 
  Mail, 
  FileText, 
  Layout, 
  CreditCard, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Types matching your onboarding form flags
interface ConsoleProps {
  initialServices?: {
    googleWorkspace: boolean;
    businessRegistry: boolean;
    websiteTemplates: boolean;
    stripeTerminal: boolean;
  };
}

export default function ManagementConsole({ 
  initialServices = {
    googleWorkspace: true, // Mocked as true to see how they render
    businessRegistry: true,
    websiteTemplates: true,
    stripeTerminal: true
  } 
}: ConsoleProps) {
  
  // Local state tracking which actions have been clicked/completed
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    google: false,
    registry: false,
    templates: false,
    terminal: false
  });

  const toggleTask = (key: string, url: string) => {
    // Open the external registration wizard in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
    
    // Mark task complete immediately upon user engagement
    setCompletedTasks(prev => ({
      ...prev,
      [key]: true
    }));
  };

  // Build the dynamic checklist arrays based strictly on what the customer checked during onboarding
  const tasks = [
    {
      key: "google",
      show: initialServices.googleWorkspace,
      label: "Click here to onboard on Google Workspace setup",
      icon: <Mail size={18} color="#FFBF00" />,
      url: "https://referworkspace.app.goo.gl/YourCustomPartnerLink"
    },
    {
      key: "registry",
      show: initialServices.businessRegistry,
      label: "Click here to Onboard for Business registry",
      icon: <FileText size={18} color="#FFBF00" />,
      url: "/dashboard/registry-wizard" // Internal or external route
    },
    {
      key: "templates",
      show: initialServices.websiteTemplates,
      label: "Click here to onboard for Website templates",
      icon: <Layout size={18} color="#FFBF00" />,
      url: "/dashboard/templates"
    },
    {
      key: "terminal",
      show: initialServices.stripeTerminal,
      label: "Click Here for Stripe terminal order completion",
      icon: <CreditCard size={18} color="#FFBF00" />,
      url: "https://dashboard.stripe.com/terminal/shop" // Stripe setup deployment
    }
  ];

  // Filter tasks to only show what they requested
  const activeTasks = tasks.filter(t => t.show);

  if (activeTasks.length === 0) return null;

  return (
    <div style={styles.consoleCard}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>🏪 Storefront Launch Protocol</h3>
          <p style={styles.subtitle}>Complete your requested configurations to optimize your storefront infrastructure.</p>
        </div>
        <span style={styles.progressBadge}>
          {Object.values(completedTasks).filter(Boolean).length} / {activeTasks.length} Done
        </span>
      </div>

      <div style={styles.taskList}>
        {activeTasks.map((task) => {
          const isDone = completedTasks[task.key];
          return (
            <div 
              key={task.key}
              onClick={() => toggleTask(task.key, task.url)}
              style={{
                ...styles.taskRow,
                border: isDone ? "1px solid rgba(74, 222, 128, 0.2)" : "1px solid rgba(255,255,255,0.05)",
                backgroundColor: isDone ? "rgba(74, 222, 128, 0.02)" : "rgba(255,255,255,0.01)"
              }}
            >
              <div style={styles.leftGroup}>
                {isDone ? (
                  <CheckCircle2 size={20} color="#4ade80" style={styles.checkIcon} />
                ) : (
                  <Circle size={20} color="#64748b" style={styles.checkIcon} />
                )}
                
                <div style={styles.iconBox}>{task.icon}</div>
                <span style={{
                  ...styles.taskLabel,
                  color: isDone ? "#94a3b8" : "#ffffff",
                  textDecoration: isDone ? "line-through" : "none"
                }}>
                  {task.label}
                </span>
              </div>

              <div style={styles.rightGroup}>
                {isDone ? (
                  <span style={styles.completedText}>COMPLETED</span>
                ) : (
                  <div style={styles.actionPrompt}>
                    <span>LAUNCH</span>
                    <ExternalLink size={12} style={{ marginLeft: "4px" }} />
                  </div>
                )}
                <ChevronRight size={16} color="#64748b" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  consoleCard: {
    backgroundColor: "#05292e",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "24px",
    padding: "28px",
    width: "100%",
    maxWidth: "840px",
    margin: "0 auto 32px auto",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "16px",
    flexWrap: "wrap" as const,
    gap: "12px"
  },
  title: { color: "#ffffff", fontSize: "16px", fontWeight: 900, margin: 0, uppercase: "true" },
  subtitle: { color: "#94a3b8", fontSize: "12px", margin: "4px 0 0 0", lineHeight: "1.5" },
  progressBadge: {
    backgroundColor: "rgba(255, 191, 0, 0.1)",
    color: "#FFBF00",
    fontSize: "11px",
    fontWeight: 900,
    padding: "6px 14px",
    borderRadius: "9999px"
  },
  taskList: { display: "flex", flexDirection: "column" as const, gap: "12px" },
  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none" as const
  },
  leftGroup: { display: "flex", alignItems: "center", gap: "14px", flex: 1 },
  checkIcon: { flexShrink: 0 },
  iconBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: "8px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  taskLabel: { fontSize: "13px", fontWeight: 700, lineHeight: "1.4" },
  rightGroup: { display: "flex", alignItems: "center", gap: "16px", marginLeft: "16px" },
  completedText: { color: "#4ade80", fontSize: "10px", fontWeight: 900, letterSpacing: "0.05em" },
  actionPrompt: {
    display: "flex",
    alignItems: "center",
    color: "#FFBF00",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.03em"
  }
};
