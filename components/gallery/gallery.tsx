"use client";

import { useRef, useState, useEffect } from "react";
import type { PhotoProps, Keyframe } from "@/utils/types";
import { IntroCard } from "./intro-card";
import { PhotoCard } from "./photo-card";

const KEYFRAMES_DESKTOP: Keyframe[] = [
  { diff: -2.0, x: 84, y: 60, scale: 0.65, opacity: 0, blur: 20, rotate: 6, grayscale: 100 },
  { diff: -1.0, x: 42, y: 30, scale: 0.85, opacity: 0.25, blur: 12, rotate: 3, grayscale: 100 },
  { diff: 0.0, x: 0, y: 0, scale: 1.15, opacity: 1, blur: 0, rotate: 0, grayscale: 0 },
  { diff: 1.0, x: -42, y: -30, scale: 0.85, opacity: 0.3, blur: 10, rotate: -3, grayscale: 100 },
  { diff: 2.0, x: -84, y: -60, scale: 0.65, opacity: 0, blur: 20, rotate: -6, grayscale: 100 },
];

const KEYFRAMES_MOBILE: Keyframe[] = [
  { diff: -2.0, x: 50, y: 70, scale: 0.65, opacity: 0, blur: 0, rotate: 4, grayscale: 100 },
  { diff: -1.0, x: 25, y: 35, scale: 0.85, opacity: 0.25, blur: 0, rotate: 2, grayscale: 100 },
  { diff: 0.0, x: 0, y: 0, scale: 1.12, opacity: 1, blur: 0, rotate: 0, grayscale: 0 },
  { diff: 1.0, x: -25, y: -35, scale: 0.85, opacity: 0.3, blur: 0, rotate: -2, grayscale: 100 },
  { diff: 2.0, x: -50, y: -70, scale: 0.65, opacity: 0, blur: 0, rotate: -4, grayscale: 100 },
];

function getInterpolatedStyle(diff: number, excludeGrayscale = false, isMobile = false) {
  const keyframes = isMobile ? KEYFRAMES_MOBILE : KEYFRAMES_DESKTOP;
  let k1 = keyframes[0];
  let k2 = keyframes[keyframes.length - 1];

  if (diff <= k1.diff) {
    return {
      transform: `translate3d(calc(${k1.x}vw - 50%), calc(${k1.y}vh - 50%), 0) scale(${k1.scale}) rotate(${k1.rotate}deg)`,
      opacity: k1.opacity,
      filter: `grayscale(${excludeGrayscale ? 0 : k1.grayscale}%) blur(${k1.blur}px) contrast(115%) brightness(95%)`,
      pointerEvents: "none" as const,
      zIndex: 5,
    };
  }
  if (diff >= k2.diff) {
    return {
      transform: `translate3d(calc(${k2.x}vw - 50%), calc(${k2.y}vh - 50%), 0) scale(${k2.scale}) rotate(${k2.rotate}deg)`,
      opacity: k2.opacity,
      filter: `grayscale(${excludeGrayscale ? 0 : k2.grayscale}%) blur(${k2.blur}px) contrast(115%) brightness(95%)`,
      pointerEvents: "none" as const,
      zIndex: 5,
    };
  }

  // Find the span
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (diff >= keyframes[i].diff && diff <= keyframes[i + 1].diff) {
      k1 = keyframes[i];
      k2 = keyframes[i + 1];
      break;
    }
  }

  const t = (diff - k1.diff) / (k2.diff - k1.diff);
  // Smoothstep interpolation factor
  const easeT = t * t * (3 - 2 * t);

  const x = k1.x + (k2.x - k1.x) * easeT;
  const y = k1.y + (k2.y - k1.y) * easeT;
  const scale = k1.scale + (k2.scale - k1.scale) * easeT;
  const opacity = k1.opacity + (k2.opacity - k1.opacity) * easeT;
  const blur = k1.blur + (k2.blur - k1.blur) * easeT;
  const rotate = k1.rotate + (k2.rotate - k1.rotate) * easeT;
  const grayscale = k1.grayscale + (k2.grayscale - k1.grayscale) * easeT;

  const grayscaleVal = excludeGrayscale ? 0 : grayscale;

  return {
    transform: `translate3d(calc(${x}vw - 50%), calc(${y}vh - 50%), 0) scale(${scale}) rotate(${rotate}deg)`,
    opacity,
    filter: `grayscale(${grayscaleVal}%) blur(${blur}px) contrast(115%) brightness(95%)`,
    zIndex: Math.round((1 - Math.abs(diff)) * 10) + 10,
    pointerEvents: Math.abs(diff) > 0.5 ? ("none" as const) : ("auto" as const),
  };
}

const SCROLL_DISTANCE = 800; // scroll pixels per slide

export function Gallery(props: { photos: PhotoProps[] }): React.JSX.Element {
  const items = [
    { type: "intro" as const },
    ...props.photos.map((photo) => ({ type: "photo" as const, photo })),
  ];

  const [p, setP] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const targetPRef = useRef(0);
  const targetIndexRef = useRef(0);

  useEffect(() => {
    // Set heights and mobile status initially
    setScrollHeight((items.length - 1) * SCROLL_DISTANCE + window.innerHeight);
    setIsMobile(window.innerWidth < 768);
    targetPRef.current = window.scrollY / SCROLL_DISTANCE;
    targetIndexRef.current = Math.round(targetPRef.current);
    setP(targetPRef.current);

    let currentP = window.scrollY / SCROLL_DISTANCE;
    let animFrameId: number;

    const tick = () => {
      const targetP = targetPRef.current;
      const diff = targetP - currentP;

      if (Math.abs(diff) > 0.0001) {
        currentP += diff * 0.12; // buttery LERP smoothing
        setP(currentP);
      } else {
        currentP = targetP;
        setP(currentP);
      }
      animFrameId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY / SCROLL_DISTANCE;
      targetPRef.current = currentScroll;
      targetIndexRef.current = Math.round(currentScroll);
    };

    const handleResize = () => {
      setScrollHeight((items.length - 1) * SCROLL_DISTANCE + window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    animFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [items.length]);

  // Keyboard navigation
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
        window.scrollTo({
          top: nextIndex * SCROLL_DISTANCE,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  // Clicking an inactive card snaps it to focus
  const handleCardClick = (e: React.MouseEvent, index: number) => {
    const diff = targetPRef.current - index;
    if (Math.abs(diff) > 0.05) {
      e.preventDefault();
      e.stopPropagation();
      targetIndexRef.current = index;
      window.scrollTo({
        top: index * SCROLL_DISTANCE,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{ height: scrollHeight || `${items.length * 80}vh` }}
      className="relative w-full"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-radial from-[#ffffff] to-[#e4e4e7] dark:from-[#1b1b1f] dark:to-[#09090b] flex items-center justify-center">
        {items.map((item, index) => {
          const diff = p - index;

          // Skip rendering elements that are completely out of view range
          if (Math.abs(diff) >= 2.0) {
            return null;
          }

          const excludeGrayscale = item.type === "intro";
          const style = getInterpolatedStyle(diff, excludeGrayscale, isMobile);
          const isLandscape = item.type === "photo" && item.photo.width > item.photo.height;
          const isFocused = Math.abs(diff) < 0.05;

          return (
            <div
              key={item.type === "intro" ? "intro" : item.photo.publicId}
              style={{ ...style, "--scroll-diff": diff } as React.CSSProperties}
              onClick={(e) => handleCardClick(e, index)}
              className={`absolute left-1/2 top-1/2 cursor-pointer will-change-transform select-none ${
                isLandscape
                  ? "w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
                  : "w-[70vw] max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4]"
              }`}
            >
              {item.type === "intro" ? (
                <IntroCard />
              ) : (
                <PhotoCard photo={item.photo} priority={index < 4} isFocused={isFocused} />
              )}
            </div>
          );
        })}

        {/* Elegant UI Controls & Slide Progress */}
        <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-between text-zinc-500 dark:text-zinc-400 font-mono text-sm mix-blend-difference select-none pointer-events-none">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-900 dark:text-white font-medium">
                {String(Math.round(p) + 1).padStart(2, "0")}
              </span>
              <span className="mx-2">/</span>
              <span>{String(items.length).padStart(2, "0")}</span>
            </div>
            <div className="relative w-24 sm:w-32 h-[2px] bg-zinc-400/30 dark:bg-zinc-700/30 overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-zinc-900 dark:bg-white transition-all duration-100"
                style={{ width: `${(p / (items.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <span className="hidden sm:inline text-xs uppercase tracking-widest opacity-60">
              {Math.abs(p - Math.round(p)) < 0.05
                ? Math.round(p) === 0
                  ? "Scroll down to explore"
                  : "Click photo to open"
                : "Scroll to next image"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const nextIndex = Math.max(0, targetIndexRef.current - 1);
                  targetIndexRef.current = nextIndex;
                  window.scrollTo({
                    top: nextIndex * SCROLL_DISTANCE,
                    behavior: "smooth",
                  });
                }}
                className="p-2 text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                aria-label="Previous image"
              >
                ↑
              </button>
              <button
                onClick={() => {
                  const nextIndex = Math.min(items.length - 1, targetIndexRef.current + 1);
                  targetIndexRef.current = nextIndex;
                  window.scrollTo({
                    top: nextIndex * SCROLL_DISTANCE,
                    behavior: "smooth",
                  });
                }}
                className="p-2 text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                aria-label="Next image"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
