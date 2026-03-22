"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
    <aside className="bazaria-sidebar">
      
      {/* --- SIDEBAR LOGO SECTION --- */}
      <div style={{
        padding: '44px 28px 36px 28px', 
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)'
      }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            color: 'white',
            fontSize: '32px', 
            fontWeight: '900', 
            letterSpacing: '-1.5px', 
            lineHeight: '1', // Adjusted to 1 for better spacing
            display: 'block'
          }}>
            BAZARIA
          </span>
          
          {/* Floating Amber Accent */}
          <div style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#FFBF00', 
            marginTop: '10px',
            borderRadius: '1px',
            boxShadow: '0 2px 8px rgba(255,191,0,0.4)'
          }}></div>
        </div>
        
        {/* Subtitle Accent */}
        <span style={{ 
          color: '#FFBF00', 
          fontSize: '10px', 
          fontWeight: 'bold', 
          letterSpacing: '2px', 
          marginTop: '12px',
          opacity: '0.9'
        }}>
          LIVING ECONOMY
        </span>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <nav className="sidebar-menu">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="sidebar-item"
          >
            <item.icon className="sidebar-icon" />
            <span className="sidebar-label">{item.name}</span>
          </Link>
        ))}
      </nav>

    </aside>
  );
}
