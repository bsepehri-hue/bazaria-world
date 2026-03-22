"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
  <aside className="bazaria-sidebar">

 {/* --- SIDEBAR LOGO: FORCED BRANDING --- */}
  <div style={{
    padding: '40px 24px 32px 24px', // Top, Right, Bottom, Left
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Forces it to the left
    width: '100%'
  }}>
    <span style={{
      color: 'white',
      fontSize: '28px', // Bigger, bolder presence
      fontWeight: '900', 
      letterSpacing: '0.05em',
      lineHeight: '1',
      fontFamily: 'inherit'
    }}>
      BAZARIA
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
