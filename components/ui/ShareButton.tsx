// components/ui/ShareButton.tsx
"use client";

import useClipboard from "@/hooks/useClipboard";
import { Check, Clipboard } from "lucide-react";

interface ShareButtonProps {
  linkToCopy: string;
  text?: string;
}

export default function ShareButton({ linkToCopy, text = "Share Auction Link" }: ShareButtonProps) {
  const { isCopied, copy } = useClipboard(3000);

  const Icon = isCopied ? Check : Clipboard;
  const buttonText = isCopied ? "Link Copied!" : text;
  const buttonClass = isCopied
    ? "bg-green-500 hover:bg-green-600"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      onClick={() => copy(linkToCopy)}
      className={`flex items-center justify-center py-2 px-4 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out whitespace-nowrap ${buttonClass}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {buttonText}
    </button>
  );
}
