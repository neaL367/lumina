"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPhotoHref } from "@/utils/photo-paths";
import type { PhotoProps } from "@/utils/types";
import type { Route } from 'next'

export function usePhotoNavigation(photos: PhotoProps[]) {
  const router = useRouter();
  const currentIndexRef = useRef(0);

  const getPhotoHrefForIndex = useCallback(
    (index: number): string | null => {
      const photoIndex = index - 1;
      if (photoIndex < 0 || photoIndex >= photos.length) return null;
      return getPhotoHref(photos[photoIndex].publicId);
    },
    [photos]
  );

  const onScrollUpdate = useCallback(
    (p: number) => {
      const roundedIndex = Math.round(p);
      if (roundedIndex === currentIndexRef.current) return;
      currentIndexRef.current = roundedIndex;
    },
    []
  );

  const navigateToPhoto = useCallback(
    (index: number, year: string | null = null, month: number | null = null) => {
      const href = getPhotoHrefForIndex(index);
      if (!href) return;
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
      router.push(href as Route, { transitionTypes: ["nav-forward"] });
    },
    [router, getPhotoHrefForIndex]
  );

  return { navigateToPhoto, onScrollUpdate, getPhotoHrefForIndex };
}
