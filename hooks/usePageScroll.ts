import { useEffect, useState } from "react";

export function usePageScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;

      setScrollY(currentY);
      setIsAtTop(currentY === 0);
      setIsScrollingDown(currentY > lastY);

      lastY = currentY;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, isScrollingDown, isAtTop };
}