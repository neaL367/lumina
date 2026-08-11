"use client";

import { useState, useLayoutEffect, useRef } from "react";

/**
 * Tracks viewport height and the mobile breakpoint (<768px).
 *
 * Uses useLayoutEffect so the values are settled *before* the gallery's own
 * layout effect runs (hook effects run in call order): the first scroll-driven
 * transform pass must already know whether to use mobile or desktop keyframes.
 */
export function useViewportHeight() {
  const [vh, setVh] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const sync = () => {
      const mobile = window.innerWidth < 768;
      setVh(window.innerHeight);
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  return { vh, isMobile, isMobileRef };
}
