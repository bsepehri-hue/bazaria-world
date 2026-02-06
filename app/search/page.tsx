import { Suspense } from "react";
import GlobalSearchPage from "./SearchClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <GlobalSearchPage />
    </Suspense>
  );
}
