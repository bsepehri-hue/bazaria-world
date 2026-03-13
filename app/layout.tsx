import "./globals.css";
import { AppProviders } from "./AppProviders";
import TopNav from "./components/ui/TopNav";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-950 text-slate-50">
        <AppProviders>
          <div className="page-shell">
            <TopNav />
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
