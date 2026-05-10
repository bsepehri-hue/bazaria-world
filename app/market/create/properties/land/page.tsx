"use client";

export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

// 1️⃣ THE CORE REDIRECT LOGIC
function LandRedirectCore() {
  const router = useRouter();

  useEffect(() => {
    // 🚀 BOUNCE: Force into Residential Portal with Land flag
    router.replace('/market/create/properties/residential?category=land');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-slate-400">
        Redirecting to Unified Portal...
      </p>
    </div>
  );
}

// 2️⃣ THE MAIN EXPORT (The Suspense Shield)
export default function OldLandRedirect() {
  return (
    <Suspense fallback={null}>
      <LandRedirectCore />
    </Suspense>
  );
}

