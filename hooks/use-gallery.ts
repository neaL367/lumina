"use client";

import { useRef, useState, useCallback, useEffect, useLayoutEffect, startTransition } from "react";
import { usePathname } from "next/navigation";
import { usePhotoNavigation } from "@/hooks/use-photo-navigation";
import { useGalleryFilter, filterPhotosByDate } from "@/hooks/use-gallery-filter";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { getInterpolatedStyle } from "@/components/gallery/interpolation";
import type { PhotoProps } from "@/utils/types";

export const CARD_SPACING_PX = 800;

// Get the key identifier for gallery items
function getItemKey(item: { type: "intro" } | { type: "photo"; photo: PhotoProps }): string {
  return item.type === "intro" ? "intro" : item.photo.publicId;
}

export function useGallery(photos: PhotoProps[]) {
  // --- Gallery Filter Hooks ---
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    filterExpanded,
    setFilterExpanded,
    years,
    months,
    filteredPhotos,
    items,
  } = useGalleryFilter(photos);

  // --- Viewport Height & Mobile Detection Hook ---
  const { vh, isMobileRef } = useViewportHeight();

  // --- React State Hooks ---
  const [p, setP] = useState(0);

  // --- Refs (Logical State & DOM Targets) ---
  const blockScrollRef = useRef(false);
  const targetIndexRef = useRef(0);
  const pRef = useRef(0);
  const lastRenderRef = useRef(0);
  const elMapRef = useRef(new Map<string, HTMLDivElement>());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // --- Navigation & Routing Hooks ---
  const pathname = usePathname();
  const restoreDoneRef = useRef(false);
  const lastPathnameRef = useRef(pathname);

  // Track if scroll position restoration has completed to prevent initial mount layout flashes
  const [isReady, setIsReady] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (pathname !== "/") return true;
    // If there is no stored index, we are ready immediately
    return sessionStorage.getItem("galleryScrollIndex") === null;
  });

  const { navigateToPhoto, onScrollUpdate } = usePhotoNavigation(filteredPhotos);

  // --- Programmatic Jump Counter ---
  // Tracks active programmatic scrolls to prevent browser resets from triggering safety nets
  const programmaticJumpCountRef = useRef(0);

  // --- Core Scroll/Programmatic Navigation Utilities ---
  const scrollTo = useCallback((index: number, immediate = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Safety-net: if the actual scroll container is not at the expected position (e.g. due to browser scroll reset),
    // instantly force it back to the current position before starting the smooth/instant scroll.
    const expectedScrollTop = Math.round(pRef.current) * CARD_SPACING_PX;
    if (Math.abs(el.scrollTop - expectedScrollTop) > 10) {
      el.scrollTo({ top: expectedScrollTop, behavior: "instant" });
    }

    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    programmaticJumpCountRef.current++;
    el.scrollTo({
      top: clampedIndex * CARD_SPACING_PX,
      behavior: immediate ? "instant" : "smooth" as ScrollBehavior
    });

    // Reset the programmatic jump flag after smooth scroll completes
    setTimeout(() => {
      programmaticJumpCountRef.current = Math.max(0, programmaticJumpCountRef.current - 1);
    }, 800);
  }, [items.length]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (blockScrollRef.current) {
      const expectedScrollTop = targetIndexRef.current * CARD_SPACING_PX;
      const maxScrollable = container.scrollHeight - container.clientHeight;
      // Only re-assert if the container is actually tall enough to be scrolled to the expected position
      if (maxScrollable >= expectedScrollTop && Math.abs(container.scrollTop - expectedScrollTop) > 1) {
        container.scrollTop = expectedScrollTop;
      }
      return;
    }

    const scrollTop = container.scrollTop;
    const expectedScrollTop = pRef.current * CARD_SPACING_PX;
    const diff = Math.abs(scrollTop - expectedScrollTop);

    // Protect against browser-initiated scroll resets during/after route transitions
    if (programmaticJumpCountRef.current === 0 && diff > CARD_SPACING_PX * 1.5) {
      container.scrollTop = expectedScrollTop;
      return;
    }

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

  // --- DOM Sync Layout Effect ---
  // Coordinates transforms/opacity writes directly to DOM at native refresh rate
  useLayoutEffect(() => {
    const elMap = elMapRef.current;
    const container = scrollContainerRef.current;

    // Reset restore state on navigation back to homepage
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      if (pathname === "/") {
        restoreDoneRef.current = false;
      }
    }

    let restoreAttempts = 0;
    const MAX_RESTORE_ATTEMPTS = 40; // ~0.6s at 60fps

    // Focus the target card to align accessibility and scroll-snap states
    const focusCard = (index: number) => {
      setTimeout(() => {
        const item = items[index];
        if (item) {
          const key = getItemKey(item);
          const cardEl = elMap.get(key);
          if (cardEl) {
            cardEl.focus({ preventScroll: true });
          }
        }
      }, 50);
    };

    const tryRestore = () => {
      if (restoreDoneRef.current) return;
      if (pathname !== "/") return;

      const storedIndex = sessionStorage.getItem("galleryScrollIndex");
      try {
        if (storedIndex === null) {
          restoreDoneRef.current = true;
          setIsReady(true);
          focusCard(0);
          return;
        }

        const parsedIndex = parseInt(storedIndex, 10);
        if (isNaN(parsedIndex) || parsedIndex <= 0) {
          restoreDoneRef.current = true;
          setIsReady(true);
          focusCard(0);
          return;
        }

        const el = scrollContainerRef.current;
        if (!el) return;

        // Restore filters first
        const storedYear = sessionStorage.getItem("galleryScrollYear");
        const storedMonth = sessionStorage.getItem("galleryScrollMonth");
        const yearVal = storedYear || null;
        const monthVal = storedMonth ? parseInt(storedMonth, 10) : null;
        setSelectedYear(yearVal);
        setSelectedMonth(monthVal);

        const tempFilteredPhotos = filterPhotosByDate(photos, yearVal, monthVal);
        const tempItemsCount = tempFilteredPhotos.length + 1;

        const clamped = Math.max(0, Math.min(tempItemsCount - 1, parsedIndex));
        const expectedScrollTop = clamped * CARD_SPACING_PX;
        const maxScrollable = el.scrollHeight - el.clientHeight;

        // If the container is not yet tall enough to hold the scroll position, wait for the next frame
        if (maxScrollable < expectedScrollTop) {
          restoreAttempts++;
          if (restoreAttempts > MAX_RESTORE_ATTEMPTS) {
            restoreDoneRef.current = true;
            setIsReady(true);
            focusCard(0);
          }
          return;
        }

        pRef.current = clamped;
        targetIndexRef.current = clamped;
        blockScrollRef.current = true;
        restoreDoneRef.current = true;
        programmaticJumpCountRef.current++;
        
        sessionStorage.removeItem("galleryScrollIndex");
        sessionStorage.removeItem("galleryScrollYear");
        sessionStorage.removeItem("galleryScrollMonth");

        el.scrollTop = expectedScrollTop;
        setP(clamped);
        setIsReady(true);
        focusCard(clamped);

        let unblocked = false;
        const unblock = () => {
          if (unblocked) return;
          unblocked = true;
          blockScrollRef.current = false;
          programmaticJumpCountRef.current = Math.max(0, programmaticJumpCountRef.current - 1);
        };
        setTimeout(unblock, 500); // 500ms covers standard view transition and routing lifecycle
      } catch (e) {
        console.error("[tryRestore] error", e);
        setIsReady(true);
      }
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
      const el = elMap.get(getItemKey(items[i]));
      if (el) updateItem(el, i);
    }

    let lastP = -999;
    let rafId: number;
    let idleFrames = 0;
    let isRunning = false;

    const tick = () => {
      tryRestore();
      const currentP = pRef.current;
      if (currentP !== lastP) {
        lastP = currentP;
        idleFrames = 0;
        for (let i = 0; i < items.length; i++) {
          const el = elMap.get(getItemKey(items[i]));
          if (el && el.isConnected) updateItem(el, i);
        }
      } else {
        idleFrames++;
      }

      if (idleFrames < 10) {
        rafId = requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      idleFrames = 0;
      rafId = requestAnimationFrame(tick);
    };

    // Start initial loop
    startLoop();

    const handleContainerScroll = () => {
      startLoop();
    };

    if (container) {
      container.addEventListener("scroll", handleContainerScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (container) {
        container.removeEventListener("scroll", handleContainerScroll);
      }
    };
  }, [items, photos, pathname]);

  // --- Keyboard Listeners Effect ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isGalleryCard = activeEl?.hasAttribute("data-gallery-card");
      if (
        !isGalleryCard && (
          activeEl?.tagName === "INPUT" ||
          activeEl?.tagName === "TEXTAREA" ||
          activeEl?.tagName === "BUTTON" ||
          activeEl?.tagName === "SELECT" ||
          activeEl?.hasAttribute("contenteditable") ||
          activeEl?.getAttribute("role") === "button"
        )
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

  // --- Public Event Handlers ---
  const handleFilterChange = useCallback((year: string | null, month: number | null) => {
    startTransition(() => {
      setSelectedYear(year);
      setSelectedMonth(month);
      pRef.current = 0;
      targetIndexRef.current = 0;
      programmaticJumpCountRef.current++;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setP(0);
      setTimeout(() => {
        programmaticJumpCountRef.current = Math.max(0, programmaticJumpCountRef.current - 1);
      }, 150);
    });
  }, [setSelectedYear, setSelectedMonth]);

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
    isReady,
  };
}
