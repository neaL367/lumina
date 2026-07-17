import { useRef, useState, useCallback, useEffect, useLayoutEffect, useMemo, startTransition } from "react";
import { usePathname } from "next/navigation";
import { usePhotoNavigation } from "@/hooks/use-photo-navigation";
import { getInterpolatedStyle } from "@/components/gallery/interpolation";
import type { PhotoProps } from "@/utils/types";

export const CARD_SPACING_PX = 800;

export function useGallery(photos: PhotoProps[]) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [filterExpanded, setFilterExpanded] = useState(false);

  const pathname = usePathname();
  const restoreDoneRef = useRef(false);
  const lastPathnameRef = useRef(pathname);

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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { navigateToPhoto, onScrollUpdate } = usePhotoNavigation(filteredPhotos);

  const scrollTo = useCallback((index: number, immediate = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    el.scrollTo({
      top: clampedIndex * CARD_SPACING_PX,
      behavior: immediate ? "instant" : "smooth" as ScrollBehavior
    });
  }, [items.length]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (blockScrollRef.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const currentP = scrollTop / CARD_SPACING_PX;
    pRef.current = currentP;
    targetIndexRef.current = Math.round(currentP); // keep target in sync with real scroll position
    onScrollUpdate(currentP);
    const now = performance.now();
    if (now - lastRenderRef.current > 16) {
      lastRenderRef.current = now;
      setP(currentP);
    }
  }, [onScrollUpdate]);

  // Animation loop — writes transforms/opacity directly to DOM at native refresh rate
  useLayoutEffect(() => {
    const elMap = elMapRef.current;

    // Reset restore state on navigation back to homepage
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      if (pathname === "/") {
        restoreDoneRef.current = false;
      }
    }

    const tryRestore = () => {
      if (restoreDoneRef.current) return;
      const stored = sessionStorage.getItem("galleryScrollIndex");
      if (pathname !== "/") return;
      try {
        if (stored === null) return;
        const parsed = parseInt(stored, 10);
        if (isNaN(parsed) || parsed <= 0) return;

        const el = scrollContainerRef.current;
        if (!el) return;

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
        
        el.scrollTop = clamped * CARD_SPACING_PX;
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
      const item = items[i];
      const key = item.type === "intro" ? "intro" : item.photo.publicId;
      const el = elMap.get(key);
      if (el) updateItem(el, i);
    }

    let lastP = -999;
    let rafId: number;
    const tick = () => {
      tryRestore();
      const currentP = pRef.current;
      if (currentP !== lastP) {
        lastP = currentP;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const key = item.type === "intro" ? "intro" : item.photo.publicId;
          const el = elMap.get(key);
          if (el && el.isConnected) updateItem(el, i);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [items, photos, pathname]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.tagName === "BUTTON" ||
        activeEl?.tagName === "SELECT" ||
        activeEl?.hasAttribute("contenteditable") ||
        activeEl?.getAttribute("role") === "button"
      ) {
        return;
      }

      let nextIndex = -1;
      const currentIndex = Math.round(pRef.current); // Use live position rather than trusting targetIndexRef alone

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
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setP(0);
    });
  }, []);

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
    const nextIndex = Math.max(0, targetIndexRef.current - 1);
    targetIndexRef.current = nextIndex;
    scrollTo(nextIndex);
  }, [scrollTo]);

  const handleNext = useCallback(() => {
    const nextIndex = Math.min(items.length - 1, targetIndexRef.current + 1);
    targetIndexRef.current = nextIndex;
    scrollTo(nextIndex);
  }, [items.length, scrollTo]);

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
    scrollContainerRef,
    handleScroll,
    handleFilterChange,
    handleCardClick,
    handlePrev,
    handleNext,
  };
}
