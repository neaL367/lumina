"use client";

import { createContext, use, useRef, useState, useCallback, useLayoutEffect, useEffect, startTransition } from "react";
import { usePathname } from "next/navigation";
import { usePhotoNavigation } from "@/hooks/use-photo-navigation";
import { useGalleryFilter } from "@/hooks/use-gallery-filter";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { getInterpolatedStyle } from "@/components/gallery/interpolation";
import type { PhotoProps } from "@/utils/types";

export const CARD_SPACING_PX = 550;

function getItemKey(item: { type: "photo"; photo: PhotoProps }): string {
  return item.photo.publicId;
}

interface GalleryState {
  p: number;
  items: { type: "photo"; photo: PhotoProps }[];
  selectedYear: string | null;
  selectedMonth: number | null;
  filterExpanded: boolean;
  years: string[];
  months: number[];
  isReady: boolean;
}

interface GalleryActions {
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  handleFilterChange: (year: string | null, month: number | null) => void;
  handleCardClick: (e: React.MouseEvent, index: number) => void;
  setFilterExpanded: (expanded: boolean) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

interface GalleryMeta {
  elMapRef: React.RefObject<Map<string, HTMLDivElement>>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  vh: number;
}

interface GalleryContextValue {
  state: GalleryState;
  actions: GalleryActions;
  meta: GalleryMeta;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGalleryContext(): GalleryContextValue {
  const ctx = use(GalleryContext);
  if (!ctx) {
    throw new Error("useGalleryContext must be used within a GalleryProvider");
  }
  return ctx;
}

export function GalleryProvider({ photos, children }: { photos: PhotoProps[]; children: React.ReactNode }) {
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

  const { vh, isMobileRef } = useViewportHeight();

  const [p, setP] = useState(0);

  const blockScrollRef = useRef(false);
  const targetIndexRef = useRef(0);
  const pRef = useRef(0);
  const lastRenderRef = useRef(0);
  const elMapRef = useRef(new Map<string, HTMLDivElement>());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const restoreDoneRef = useRef(false);
  const lastPathnameRef = useRef(pathname);
  const [isReady, setIsReady] = useState(false);
  const programmaticJumpCountRef = useRef(0);

  const { navigateToPhoto, onScrollUpdate } = usePhotoNavigation(filteredPhotos);

  const scrollTo = useCallback((index: number, immediate = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const expectedScrollTop = Math.round(pRef.current) * CARD_SPACING_PX;
    if (Math.abs(el.scrollTop - expectedScrollTop) > 10) {
      el.scrollTo({ top: expectedScrollTop, behavior: "instant" });
    }

    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    programmaticJumpCountRef.current++;
    el.scrollTo({
      top: clampedIndex * CARD_SPACING_PX,
      behavior: immediate ? "instant" : "smooth",
    });

    setTimeout(() => {
      programmaticJumpCountRef.current = Math.max(0, programmaticJumpCountRef.current - 1);
    }, 800);
  }, [items.length]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (blockScrollRef.current) {
      const expectedScrollTop = targetIndexRef.current * CARD_SPACING_PX;
      const maxScrollable = container.scrollHeight - container.clientHeight;
      if (maxScrollable >= expectedScrollTop && Math.abs(container.scrollTop - expectedScrollTop) > 1) {
        container.scrollTop = expectedScrollTop;
      }
      return;
    }

    const scrollTop = container.scrollTop;
    const expectedScrollTop = pRef.current * CARD_SPACING_PX;
    const diff = Math.abs(scrollTop - expectedScrollTop);

    if (programmaticJumpCountRef.current === 0 && diff > CARD_SPACING_PX * 1.5) {
      container.scrollTop = expectedScrollTop;
      return;
    }

    const currentP = scrollTop / CARD_SPACING_PX;
    pRef.current = currentP;
    targetIndexRef.current = Math.round(currentP);
    onScrollUpdate(currentP);

    const now = performance.now();
    if (now - lastRenderRef.current > 16) {
      lastRenderRef.current = now;
      setP(currentP);
    }
  }, [onScrollUpdate]);

  useLayoutEffect(() => {
    const elMap = elMapRef.current;
    const container = scrollContainerRef.current;

    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      if (pathname === "/") {
        restoreDoneRef.current = false;
      }
    }

    let restoreAttempts = 0;
    const MAX_RESTORE_ATTEMPTS = 40;

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

      const cachedIndex = sessionStorage.getItem("galleryScrollIndex");
      if (cachedIndex === null) {
        restoreDoneRef.current = true;
        setIsReady(true);
        return;
      }

      const parsedIndex = parseInt(cachedIndex, 10);
      if (isNaN(parsedIndex) || parsedIndex <= 0) {
        restoreDoneRef.current = true;
        setIsReady(true);
        return;
      }

      const el = scrollContainerRef.current;
      if (!el) return;

      const cachedYear = sessionStorage.getItem("galleryScrollYear");
      const cachedMonth = sessionStorage.getItem("galleryScrollMonth");
      const yearVal = cachedYear || null;
      const monthVal = cachedMonth ? parseInt(cachedMonth, 10) : null;
      setSelectedYear(yearVal);
      setSelectedMonth(monthVal);

      const clamped = Math.max(0, Math.min(items.length - 1, parsedIndex));
      const expectedScrollTop = clamped * CARD_SPACING_PX;
      const maxScrollable = el.scrollHeight - el.clientHeight;

      if (maxScrollable < expectedScrollTop) {
        restoreAttempts++;
        if (restoreAttempts > MAX_RESTORE_ATTEMPTS) {
          restoreDoneRef.current = true;
          setIsReady(true);
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
      setTimeout(unblock, 500);
    };

    const updateItem = (el: HTMLDivElement, index: number) => {
      const diff = pRef.current - index;

      if (Math.abs(diff) >= 3.0) {
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
      const currentIndex = Math.round(pRef.current);

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextIndex = Math.min(items.length - 1, currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex = Math.max(0, currentIndex - 1);
      }

      if (nextIndex !== -1) {
        if (programmaticJumpCountRef.current > 0) return;
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

  const state: GalleryState = {
    p,
    items,
    selectedYear,
    selectedMonth,
    filterExpanded,
    years,
    months,
    isReady,
  };

  const actions: GalleryActions = {
    handleScroll,
    handleFilterChange,
    handleCardClick,
    setFilterExpanded,
    handlePrev,
    handleNext,
  };

  const meta: GalleryMeta = {
    elMapRef,
    scrollContainerRef,
    vh,
  };

  return (
    <GalleryContext value={{ state, actions, meta }}>
      {children}
    </GalleryContext>
  );
}
