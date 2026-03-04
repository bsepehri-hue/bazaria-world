import "./globals.css";

import AuthProvider from "./providers/AuthProvider";
import { Providers } from "./providers";
import { WalletProvider } from "./context/WalletContext";
import ClientTopNavWrapper from "./components/ui/ClientTopNavWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50 overflow-visible">

        {/* GLOBAL PROVIDERS */}
        <AuthProvider>
          <Providers>
            <WalletProvider>

              {/* ================================
                  TOP NAVIGATION (GLOBAL LAYER)
                 ================================ */}
              <nav className="top-nav">
                <div className="nav-left">
                  <img src="/bazaria-logo.svg" alt="Bazaria" className="nav-logo" />
                </div>

                <div className="nav-center">
                  <input type="text" className="search-input" placeholder="Search..." />
                </div>

                <div className="nav-right">
                  <i className="fa-solid fa-location-dot"></i>
                  <i className="fa-solid fa-bell"></i>
                  <i className="fa-solid fa-envelope"></i>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <i className="fa-solid fa-wallet"></i>
                </div>
              </nav>


              {/* ================================
                  SIDEBAR (WORLD NAVIGATION)
                 ================================ */}
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


              {/* ================================
                  SLIDING SUBMENU PANEL
                 ================================ */}
              <div id="submenu" className="submenu-panel">

                {/* Cars submenu */}
                <div className="submenu-group" data-parent="cars">
                  <div className="submenu-item">Sedans</div>
                  <div className="submenu-item">SUVs</div>
                  <div className="submenu-item">Trucks</div>

                  <div className="submenu-divider"></div>

                  <div className="submenu-item">Electric</div>
                  <div className="submenu-item">Luxury</div>
                  <div className="submenu-item">Classics</div>
                </div>

                {/* Homes submenu */}
                <div className="submenu-group" data-parent="homes">
                  <div className="submenu-item">For Sale</div>
                  <div className="submenu-item">For Rent</div>

                  <div className="submenu-divider"></div>

                  <div className="submenu-item">Land</div>
                  <div className="submenu-item">Commercial</div>
                </div>

              </div>


              {/* ================================
                  PAGE CONTENT (PUSHED DOWN)
                 ================================ */}
              <main className="pt-[152px]">
                {children}
              </main>


              {/* ================================
                  SUBMENU BEHAVIOR SCRIPT
                 ================================ */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    const sidebarItems = document.querySelectorAll('.sidebar-item');
                    const submenuPanel = document.getElementById('submenu');
                    const submenuGroups = document.querySelectorAll('.submenu-group');

                    sidebarItems.forEach(item => {
                      item.addEventListener('mouseenter', () => {
                        const category = item.dataset.category;

                        submenuGroups.forEach(group => {
                          group.style.display = group.dataset.parent === category ? 'block' : 'none';
                        });

                        submenuPanel.classList.add('open');
                      });
                    });

                    sidebarItems.forEach(item => {
                      item.addEventListener('mouseleave', () => {
                        setTimeout(() => submenuPanel.classList.remove('open'), 200);
                      });
                    });

                    submenuPanel.addEventListener('mouseenter', () => {
                      submenuPanel.classList.add('open');
                    });

                    submenuPanel.addEventListener('mouseleave', () => {
                      submenuPanel.classList.remove('open');
                    });
                  `,
                }}
              />

            </WalletProvider>
          </Providers>
        </AuthProvider>

      </body>
    </html>
  );
}
