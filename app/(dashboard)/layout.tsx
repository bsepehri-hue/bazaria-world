import { Suspense } from "react"; // 🎯 Added Suspense
import AppFrame from "@/components/layout/AppFrame";

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={null}> 
      <AppFrame>{children}</AppFrame>
    </Suspense>
  );
}
