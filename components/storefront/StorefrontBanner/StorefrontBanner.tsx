
"use client";

import { useState } from "react";
import { ThreeDotMenu } from "@/components/common/ThreeDotMenu";
import { RatingStars } from "@/components/common/RatingStars";
import { StorefrontBannerSkeleton } from "./StorefrontBannerSkeleton";
import { useStorefrontBanner } from "@/hooks/useStorefrontBanner";
import { ShareModal } from "@/components/modals/ShareModal";

export function StorefrontBanner({ storefrontId }: { storefrontId: string }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  

  const { data, isLoading, isError, isCompressed } =
    useStorefrontBanner(storefrontId);

  if (isLoading) return <StorefrontBannerSkeleton />;
  if (isError || !data) return null;

  const {
    storeName,
    tagline,
    location,
    bannerImageUrl,
    brandColor,
    rating,
    reviewCount,
    isFollowedByCurrentUser,
  } = data;

  const bgStyle = bannerImageUrl
    ? {
        backgroundImage: `url(${bannerImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(135deg, ${
          brandColor ?? "#008080"
        } 0%, ${brandColor ?? "#008080"}B3 100%)`,
      };

  return (
    <>
      <div
        className={`w-full transition-all duration-300 ease-out ${
          isCompressed ? "h-[72px]" : "h-[260px]"
        } relative rounded-md overflow-hidden`}
        style={bgStyle}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Foreground */}
        <div className="relative z-10 h-full flex justify-between items-end px-6 pb-6">
          {/* Left Block */}
          <div className="flex flex-col max-w-[60%]">
            <h1
              className={`text-white font-bold transition-all duration-300 ${
                isCompressed ? "text-xl" : "text-4xl"
              } truncate`}
            >
              {storeName}
            </h1>

            {!isCompressed && rating && (
              <div className="mt-1">
                <RatingStars rating={rating} reviewCount={reviewCount} />
              </div>
            )}

            {!isCompressed && tagline && (
              <p className="text-white/80 text-lg truncate">{tagline}</p>
            )}

            {!isCompressed && location && (
              <p className="text-white/70 text-sm">
                {location.city}, {location.state}
              </p>
            )}
          </div>

          {/* Right Block */}
          <div className="flex gap-3">
            <button className="bg-black/40 text-white px-4 py-2 rounded-lg">
              {isFollowedByCurrentUser ? "Following" : "Follow"}
            </button>

            <div className="hidden sm:flex gap-3 transition-all duration-300">
              {!isCompressed && (
                <>
                  <button
                    className="bg-black/40 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShareOpen(true)}
                  >
                    Share
                  </button>

                  <button
                    className="bg-black/40 text-white px-4 py-2 rounded-lg"
                    onClick={() => setContactOpen(true)}
                  >
                    Contact
                  </button>
                </>
              )}
            </div>

            <div className="sm:hidden">
              <ThreeDotMenu>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShareOpen(true)}
                >
                  Share
                </button>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setContactOpen(true)}
                >
                  Contact
                </button>
              </ThreeDotMenu>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        storeName={storeName}
        storeUrl={`https://listtobid.com/store/${storefrontId}`}
      />
    </>
  );
}
