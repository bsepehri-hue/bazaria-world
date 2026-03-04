"use client";

import ClientTopNav from "@/app/components/ui/ClientTopNav";

export default function MarketLayout({ children }) {
  return (
    <div className="market-layout">

      {/* FIXED TOPNAV CONTAINER */}
      <div className="topnav-container">
        <ClientTopNav />
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <img src="/bazaria-logo.svg" alt="Bazaria" className="logo" />

        <div className="sidebar-item" data-category="cars">
          <i className="fa-solid fa-car"></i>
          <span>Cars</span>
        </div>

        <div className="sidebar-item" data-category="homes">
          <i className="fa-solid fa-house"></i>
          <span>Homes</span>
        </div>

        <div className="sidebar-item" data-category="rentals">
          <i className="fa-solid fa-key"></i>
          <span>Rentals</span>
        </div>

        <div className="sidebar-item" data-category="pets">
          <i className="fa-solid fa-paw"></i>
          <span>Pets</span>
        </div>

        <div className="sidebar-item" data-category="services">
          <i className="fa-solid fa-briefcase"></i>
          <span>Services</span>
        </div>

        <div className="sidebar-item" data-category="general">
          <i className="fa-solid fa-box"></i>
          <span>General</span>
        </div>
      </aside>

      {/* SUBMENU PANEL */}
      <div id="submenu" className="submenu-panel">
        <div className="submenu-group" data-parent="cars">
          <div className="submenu-item">Sedans</div>
          <div className="submenu-item">SUVs</div>
          <div className="submenu-item">Trucks</div>
          <div className="submenu-divider"></div>
          <div className="submenu-item">Electric</div>
          <div className="submenu-item">Luxury</div>
          <div className="submenu-item">Classics</div>
        </div>

        <div className="submenu-group" data-parent="homes">
          <div className="submenu-item">For Sale</div>
          <div className="submenu-item">For Rent</div>
          <div className="submenu-divider"></div>
          <div className="submenu-item">Land</div>
          <div className="submenu-item">Commercial</div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="pt-[72px] pl-[220px] pr-6 pb-6">
        {children}
      </main>

    </div>
  );
}
