
"use client";

import { usePathname } from "next/navigation";
import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/market/create");

  return (
    <AppFrame>
      {isCreateFlow && (
        <style dangerouslySetInnerHTML={{ __html: `
  :root {
    /* 🛡️ THE HIJACK: 
       We tell the browser that for this page, 
       'Teal Primary' is now the 'Offwhite' color. 
    */
    --teal-primary: #f8f8f5 !important;
    --offwhite-canvas: #f8f8f5 !important;
  }

  /* 🛡️ Ensure the main container respects the override */
  main, .page-body, .page-content {
    background-color: var(--teal-primary) !important;
  }

  /* 🛡️ Ensure text stays visible (Black) since background is now white */
  .page-content, main {
    color: #000000 !important;
  }
`}} />
      )}

      <div id="create-portal-wrapper" className={isCreateFlow ? "p-8 md:p-16 lg:p-24" : ""}>
        {children}
      </div>
    </AppFrame>
  );
}
