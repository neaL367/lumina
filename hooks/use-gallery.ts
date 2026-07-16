import { useRef, useState, useCallback, useEffect, useLayoutEffect, useMemo, startTransition } from "react";
import { usePathname } from "next/navigation";
import { useLenisScroll } from "@/hooks/use-lenis-scroll";
import { usePhotoNavigation } from "@/hooks/use-photo-navigation";
import { getInterpolatedStyle } from "@/components/gallery/interpolation";
import type { PhotoProps } from "@/utils/types";

export function useGallery(photos: PhotoProps[]) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [filterExpanded, setFilterExpanded] = useState(false);

  const pathname = usePathname();
  const restoreDoneRef = useRef(false);
  const lastPathnameRef = useRef(pathname);

  // Synchronously reset restore state on navigation back to homepage
  if (pathname !== lastPathnameRef.current) {
    lastPathnameRef.current = pathname;
    if (pathname === "/") {
      restoreDoneRef.current = false;
    }
  }

  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    photos.forEach((photo) => {
      if (photo.createdAt) {
        const year = new Date(photo.createdAt).getFullYear().toString();
        uniqueYears.add(year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a));
  }, [photos]);

  const months = useMemo(() => {
    if (!selectedYear) return [];
    const uniqueMonths = new Set<number>();
    photos.forEach((photo) => {
      if (photo.createdAt) {
        const date = new Date(photo.createdAt);
        if (date.getFullYear().toString() === selectedYear) {
          uniqueMonths.add(date.getMonth());
        }
      }
    });
    return Array.from(uniqueMonths).sort((a, b) => a - b);
  }, [photos, selectedYear]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (!photo.createdAt) return !selectedYear;
      const date = new Date(photo.createdAt);
      if (selectedYear && date.getFullYear().toString() !== selectedYear) {
        return false;
      }
      if (selectedMonth !== null && date.getMonth() !== selectedMonth) {
        return false;
      }
      return true;
    });
  }, [photos, selectedYear, selectedMonth]);

  'use memo'
  const items = useMemo(() => [
    { type: "intro" as const },
    ...filteredPhotos.map((photo) => ({ type: "photo" as const, photo })),
  ], [filteredPhotos]);

  const blockScrollRef = useRef(false);
  const targetIndexRef = useRef(0);
  const pRef = useRef(0);

  const [p, setP] = useState(0);
  const [vh, setVh] = useState(0);
  const lastRenderRef = useRef(0);
  const elMapRef = useRef(new Map<string, HTMLDivElement>());
  const isMobileRef = useRef(false);

  const { scrollTo, snapToNext, snapToPrev, onScroll, lenisRef } = useLenisScroll(items.length);
  const { navigateToPhoto, onScrollUpdate } = usePhotoNavigation(filteredPhotos);

  // Animation loop — writes transforms/opacity directly to DOM at native refresh rate
  useLayoutEffect(() => {
    const elMap = elMapRef.current;

    const tryRestore = () => {
      if (restoreDoneRef.current) return;
      const stored = sessionStorage.getItem("galleryScrollIndex");
      if (pathname !== "/") return;
      try {
        if (stored === null) return;
        const parsed = parseInt(stored, 10);
        if (isNaN(parsed) || parsed <= 0) return;

        const lenis = lenisRef.current;
        if (!lenis) return;

        // Restore filters first
        const storedYear = sessionStorage.getItem("galleryScrollYear");
        const storedMonth = sessionStorage.getItem("galleryScrollMonth");
        const yearVal = storedYear || null;
        const monthVal = storedMonth ? parseInt(storedMonth, 10) : null;
        setSelectedYear(yearVal);
        setSelectedMonth(monthVal);

        const tempFilteredPhotos = photos.filter((photo) => {
          if (!photo.createdAt) return !yearVal;
          const date = new Date(photo.createdAt);
          if (yearVal && date.getFullYear().toString() !== yearVal) return false;
          if (monthVal !== null && date.getMonth() !== monthVal) return false;
          return true;
        });
        const tempItemsCount = tempFilteredPhotos.length + 1;

        const clamped = Math.max(0, Math.min(tempItemsCount - 1, parsed));
        pRef.current = clamped;
        targetIndexRef.current = clamped;
        blockScrollRef.current = true;
        restoreDoneRef.current = true;
        sessionStorage.removeItem("galleryScrollIndex");
        sessionStorage.removeItem("galleryScrollYear");
        sessionStorage.removeItem("galleryScrollMonth");
        lenis.scrollTo(clamped * 800, { immediate: true });
        setP(clamped);
        setTimeout(() => {
          blockScrollRef.current = false;
        }, 100);
      } catch (e) { console.error("[tryRestore] error", e); }
    };

    const updateItem = (el: HTMLDivElement, index: number) => {
      const diff = pRef.current - index;

      if (Math.abs(diff) >= 2.0) {
        el.style.display = "none";
        return;
      }

      el.style.display = "";
      const style = getInterpolatedStyle(diff, isMobileRef.current);
      el.style.transform = style.transform;
      el.style.opacity = String(style.opacity);
      el.style.zIndex = String(style.zIndex);
      el.style.pointerEvents = style.pointerEvents;
      el.style.setProperty("--scroll-diff", String(diff));
    };

    // Synchronous initial sync before first paint
    tryRestore();
    for (let i = 0; i < items.length; i++) {
      const key = i === 0 ? "intro" : filteredPhotos[i - 1].publicId;
      const el = elMap.get(key);
      if (el) updateItem(el, i);
    }

    let rafId: number;
    const tick = () => {
      tryRestore();
      for (let i = 0; i < items.length; i++) {
        const key = i === 0 ? "intro" : filteredPhotos[i - 1].publicId;
        const el = elMap.get(key);
        if (el && el.isConnected) updateItem(el, i);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [items, photos, filteredPhotos, lenisRef, pathname, setSelectedYear, setSelectedMonth]);

  useEffect(() => {
    const sync = () => {
      const mobile = window.innerWidth < 768;
      setVh(window.innerHeight);
      isMobileRef.current = mobile;
    };
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    const unsub = onScroll((currentP) => {
      if (blockScrollRef.current) return;
      pRef.current = currentP;
      onScrollUpdate(currentP);
      const now = performance.now();
      if (now - lastRenderRef.current > 16) {
        lastRenderRef.current = now;
        setP(currentP);
      }
    });
    return unsub;
  }, [onScroll, onScrollUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      let nextIndex = -1;
      const currentIndex = targetIndexRef.current;

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextIndex = Math.min(items.length - 1, currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex = Math.max(0, currentIndex - 1);
      }

      if (nextIndex !== -1) {
        targetIndexRef.current = nextIndex;
        scrollTo(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, scrollTo]);

  const handleFilterChange = useCallback((year: string | null, month: number | null) => {
    startTransition(() => {
      setSelectedYear(year);
      setSelectedMonth(month);
      pRef.current = 0;
      targetIndexRef.current = 0;
      lenisRef.current?.scrollTo(0, { immediate: true });
      setP(0);
    });
  }, [lenisRef]);

  const handleCardClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      const currentP = pRef.current;
      const diff = currentP - index;
      if (Math.abs(diff) > 0.05) {
        e.preventDefault();
        e.stopPropagation();
        targetIndexRef.current = index;
        scrollTo(index);
      } else if (index > 0) {
        navigateToPhoto(index, selectedYear, selectedMonth);
      }
    },
    [scrollTo, navigateToPhoto, selectedYear, selectedMonth]
  );

  const handlePrev = useCallback(() => {
    targetIndexRef.current = Math.max(0, targetIndexRef.current - 1);
    snapToPrev();
  }, [snapToPrev]);

  const handleNext = useCallback(() => {
    targetIndexRef.current = Math.min(items.length - 1, targetIndexRef.current + 1);
    snapToNext();
  }, [items.length, snapToNext]);

  return {
    selectedYear,
    selectedMonth,
    filterExpanded,
    setFilterExpanded,
    years,
    months,
    items,
    p,
    vh,
    elMapRef,
    handleFilterChange,
    handleCardClick,
    handlePrev,
    handleNext,
  };
}
