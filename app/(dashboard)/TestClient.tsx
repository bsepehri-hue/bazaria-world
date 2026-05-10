"use client";

import { useEffect } from "react";

export default function TestClient() {
  useEffect(() => {
    console.log("HYDRATED");
  }, []);

  return null;
}