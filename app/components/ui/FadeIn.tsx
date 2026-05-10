"use client";

import React, { useEffect, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // optional delay in ms
}

export default function FadeIn({ children, delay = 50 }: FadeInProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`fade-in ${show ? "show" : ""}`}>
      {children}
    </div>
  );
}
