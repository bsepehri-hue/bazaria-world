"use client";

import { useState, useCallback } from "react";

export default function useClipboard(resetInterval = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetInterval);
      } catch (err) {
        console.error("Clipboard copy failed", err);
      }
    },
    [resetInterval]
  );

  return { isCopied, copy };
}
