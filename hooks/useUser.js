"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client"; // Adjusted to match your tree
import { doc, getDoc } from "firebase/firestore";
import { UserProfile, LicenseClass, LicenseStatus } from "@/lib/profile";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Load the Sovereign Profile
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🛡️ SOVEREIGN AUTHORITY CHECKS
  // These allow you to gate UI elements with "Software Sanity"
  const licenseClass: LicenseClass = profile?.licenseClass || "NONE";
  const licenseStatus: LicenseStatus = profile?.licenseStatus || "PROVISIONAL";
  
  const isL5 = licenseClass === "L5_ESTATE";
  const isL3 = licenseClass === "L3_MOBILITY";
  const isL1 = licenseClass === "L1_GENERAL";
  
  const isPerformanceHalted = licenseStatus === "SUSPENDED" || licenseStatus === "REVOKED";
  const isTrialActive = licenseStatus === "PROVISIONAL";

  return {
    user,
    profile,
    loading,
    // Authority Levels
    isL5,
    isL3,
    isL1,
    // Status Checks
    canFacilitate: isL5 && !isPerformanceHalted,
    isPerformanceHalted,
    isTrialActive,
    // Roles (Legacy Support)
    isAdmin: profile?.role === "admin",
    satisfaction: profile?.satisfactionScore || 0,
  };
}
