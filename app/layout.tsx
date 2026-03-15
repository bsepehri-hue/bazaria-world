import "./globals.css";
import { AppProviders } from "./AppProviders";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-950 text-slate-50">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
