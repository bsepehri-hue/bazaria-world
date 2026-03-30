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
          
         {/* Floating Amber Accent: Now more dynamic and scaled */}
<div style={{
  width: '100%',            // Let it scale with the text
  maxWidth: '120px',        // But cap it so it doesn't overwhelm the space
  height: '4px',
  background: 'linear-gradient(90deg, #FFBF00 0%, #E5A100 100%)', // Multi-tone amber for depth
  marginTop: '12px',
  borderRadius: '2px',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(255, 191, 0, 0.3)' // Softer, more professional glow
}}>
  {/* Optional: The "Glow Tip" - adds a little spark to the end of the line */}
  <div style={{
    position: 'absolute',
    right: '0',
    top: '0',
    width: '10px',
    height: '100%',
    background: '#FFF',
    opacity: '0.3',
    borderRadius: '2px'
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
         A LIVING ECONOMY
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
