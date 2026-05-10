import { useEffect, useState } from "react";

export function useTabVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleVisibility() {
      setIsVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return { isVisible };
}
