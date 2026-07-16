"use client";

import { useEffect } from "react";

export function StoreScrollIndex({ from }: { from?: string }) {
  useEffect(() => {
    if (from) {
      try {
        sessionStorage.setItem("galleryScrollIndex", from);
        sessionStorage.setItem("galleryScrollTimestamp", String(Date.now()));
      } catch {}
    }
  }, [from]);

  return null;
}
