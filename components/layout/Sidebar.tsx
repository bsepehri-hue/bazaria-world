"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
  <aside className="bazaria-sidebar">

{/* --- SIDEBAR LOGO: PREMIUM RE-DESIGN --- */}
  <div style={{
    padding: '44px 28px 36px 28px', 
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)' // Subtle depth
  }}>
    <div style={{ position: 'relative' }}>
      <span style={{
        color: 'white',
        fontSize: '32px', 
        fontWeight: '900', 
        letterSpacing: '-1.5px', // Modern "tight" branding
        lineHeight: '0.8',
        display: 'block'
      }}>
        BAZARIA
      </span>
      
      {/* Floating Amber Accent */}
      <div style={{
        width: '40px',
        height: '4px',
        backgroundColor: '#FFBF00', 
        marginTop: '12px',
        borderRadius: '1px',
        boxShadow: '0 2px 8px rgba(255,191,0,0.4)' // Gives it that "living" glow
      }}></div>
    </div>
    
    <span style={{ 
      color: '#FFBF00', 
      fontSize: '10px', 
      fontWeight: 'bold', 
      letterSpacing: '2px', 
      marginTop: '10px',
      opacity: '0.8'
    }}>
      LIVING ECONOMY
    </span>
  </div>
    </span>
    
    {/* The Amber Twist */}
    <div style={{
      width: '60px',
      height: '3px',
      backgroundColor: '#FFBF00', // Matches your map amber
      marginTop: '8px',
      borderRadius: '2px'
    }}></div>
  </div>
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
