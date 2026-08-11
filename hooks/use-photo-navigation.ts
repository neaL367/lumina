"use client";

import { useCallback, useRef } from "react";

/**
 * Persists the gallery scroll position (index + active date filter) before a
 * photo card navigates, so the gallery can restore it on the way back.
 *
 * Navigation itself goes through the card's <Link> (runtime prefetch via
 * prefetch={true}); this hook only records the state the return trip needs.
 */
export function usePhotoNavigation() {
  const currentIndexRef = useRef(0);

  const onScrollUpdate = useCallback((p: number) => {
    const roundedIndex = Math.round(p);
    if (roundedIndex === currentIndexRef.current) return;
    currentIndexRef.current = roundedIndex;
  }, []);

  const preparePhotoNavigation = useCallback(
    (index: number, year: string | null = null, month: number | null = null) => {
      try {
        sessionStorage.setItem("galleryScrollIndex", String(index));
        if (year) {
          sessionStorage.setItem("galleryScrollYear", year);
        } else {
          sessionStorage.removeItem("galleryScrollYear");
        }
        if (month !== null) {
          sessionStorage.setItem("galleryScrollMonth", String(month));
        } else {
          sessionStorage.removeItem("galleryScrollMonth");
        }
        sessionStorage.setItem("galleryScrollTimestamp", String(Date.now()));
      } catch {
        // sessionStorage may be unavailable in private browsing
      }
    },
    []
  );

  return { onScrollUpdate, preparePhotoNavigation };
}
