import "./globals.css";
import { AppProviders } from "./AppProviders";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 🛡️ Swap bg-slate-950 (Dark) for bg-[#f8f8f5] (Off-white) 
          and text-slate-50 (White) for text-slate-900 (Dark) */}
      <body className="font-sans bg-[#f8f8f5] text-slate-900">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
