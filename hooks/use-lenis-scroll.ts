"use client";

import { useRef, useCallback, useEffect } from "react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import Snap from "lenis/snap";

const SCROLL_DISTANCE = 800;

export function useLenisScroll(itemCount: number) {
  const pRef = useRef(0);
  const callbacksRef = useRef<Set<(p: number) => void>>(new Set());
  const lenisRef = useRef<Lenis | null>(null);
  const snapRef = useRef<Snap | null>(null);

  const lenis = useLenis(
    useCallback((l: Lenis) => {
      const p = l.animatedScroll / SCROLL_DISTANCE;
      pRef.current = p;
      callbacksRef.current.forEach((cb) => cb(p));
    }, [])
  );

  useEffect(() => {
    lenisRef.current = lenis ?? null;
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const snap = new Snap(lenis, {
      type: "lock",
      duration: 0.25,
    });

    for (let i = 0; i < itemCount; i++) {
      snap.add(i * SCROLL_DISTANCE);
    }

    snapRef.current = snap;

    return () => {
      snap.destroy();
      snapRef.current = null;
    };
  }, [lenis, itemCount]);

  const scrollTo = useCallback(
    (index: number, immediate = false) => {
      const l = lenisRef.current;
      if (!l) return;
      const clampedIndex = Math.max(0, Math.min(itemCount - 1, index));
      l.scrollTo(clampedIndex * SCROLL_DISTANCE, { immediate });
    },
    [itemCount]
  );

  const snapToNext = useCallback(() => {
    snapRef.current?.next();
  }, []);

  const snapToPrev = useCallback(() => {
    snapRef.current?.previous();
  }, []);

  const onScroll = useCallback((cb: (p: number) => void) => {
    callbacksRef.current.add(cb);
    return () => {
      callbacksRef.current.delete(cb);
    };
  }, []);

  return { scrollTo, snapToNext, snapToPrev, onScroll, lenisRef, get p() { return pRef.current; }, lenis };
}
