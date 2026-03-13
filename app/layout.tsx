import "./globals.css";
import { AppProviders } from "./AppProviders";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-950 text-slate-50">
        <AppProviders>
          <div className="page-shell">
            <TopNav />
            <div className="page-body">
              <Sidebar />
              <main className="page-content">
                {children}
              </main>
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
