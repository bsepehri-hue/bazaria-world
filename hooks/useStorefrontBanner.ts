import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useStorefrontBanner(storefrontId: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);

  // Firestore subscription
  useEffect(() => {
    const ref = doc(db, "storefronts", storefrontId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setIsError(true);
          setIsLoading(false);
          return;
        }

        const d = snap.data();

        setData({
          storeName: d.storeName,
          tagline: d.tagline ?? null,
          location: d.location ?? null,
          bannerImageUrl: d.bannerImageUrl ?? null,
          brandColor: d.brandColor ?? null,
          logoUrl: d.logoUrl ?? null,
          rating: d.rating ?? null,
          reviewCount: d.reviewCount ?? null,
          followers: d.followers ?? 0,
          isFollowedByCurrentUser: d.isFollowedByCurrentUser ?? false,
        });

        setIsLoading(false);
      },
      () => {
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [storefrontId]);

  // Scroll compression
  useEffect(() => {
    const handleScroll = () => {
      setIsCompressed(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { data, isLoading, isError, isCompressed };
}
