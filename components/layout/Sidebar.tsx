"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
    <aside className="bazaria-sidebar" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
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
            lineHeight: '1', 
            display: 'block'
          }}>
            BAZARIA
          </span>
          
          {/* THE HOME RUN AMBER LINE: Longer, Glowing Foundation */}
          <div style={{
            width: '110px',            // Longer foundation
            height: '4px',
            background: 'linear-gradient(90deg, #FFBF00 0%, #E5A100 100%)', 
            marginTop: '12px',
            borderRadius: '2px',
            boxShadow: '0 4px 12px rgba(255, 191, 0, 0.4)' 
          }}></div>
        </div>
        
        {/* Subtitle: Spread out for luxury feel */}
        <span style={{ 
          color: '#FFBF00', 
          fontSize: '10px', 
          fontWeight: 'bold', 
          letterSpacing: '3.5px', // Wider spacing
          marginTop: '14px',
          opacity: '0.9',
          display: 'block'
        }}>
          A LIVING ECONOMY
        </span>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <nav className="sidebar-menu" style={{ flex: 1, overflowY: 'auto' }}>
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
