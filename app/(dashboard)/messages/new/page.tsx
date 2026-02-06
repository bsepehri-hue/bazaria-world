import { Suspense } from "react";
import NewMessageClient from "./NewMessageClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-gray-600 p-6">Preparing…</p>}>
      <NewMessageClient />
    </Suspense>
  );
}
