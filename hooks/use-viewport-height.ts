"use client";

import { useState, useEffect, useRef } from "react";

export function useViewportHeight() {
  const [vh, setVh] = useState(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const sync = () => {
      const mobile = window.innerWidth < 768;
      setVh(window.innerHeight);
      isMobileRef.current = mobile;
    };
    
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  return { vh, isMobileRef };
}
