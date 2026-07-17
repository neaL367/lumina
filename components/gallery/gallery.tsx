"use client";

import type { PhotoProps } from "@/utils/types";
import { IntroCard } from "./intro-card";
import { PhotoCard } from "./photo-card";
import { useGallery, CARD_SPACING_PX } from "@/hooks/use-gallery";
import { GalleryFilter } from "./gallery-filter";

function GalleryInner({ photos }: { photos: PhotoProps[] }): React.JSX.Element {
  const {
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
  } = useGallery(photos);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="relative w-full h-dvh overflow-y-auto snap-y snap-mandatory no-scrollbar"
    >
      {/* Invisible Snap Points */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: vh ? `${(items.length - 1) * CARD_SPACING_PX + vh}px` : `${items.length * 100}vh` }}
      >
        {items.map((_, index) => (
          <div
            key={`snap-${index}`}
            className="absolute w-full h-[1px]"
            style={{
              top: `${index * CARD_SPACING_PX}px`,
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
            }}
          />
        ))}
      </div>

      {/* Floating Date Filter Pill */}
      <GalleryFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        filterExpanded={filterExpanded}
        setFilterExpanded={setFilterExpanded}
        years={years}
        months={months}
        handleFilterChange={handleFilterChange}
      />

      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-radial from-[#ffffff] to-[#e4e4e7] dark:from-[#1b1b1f] dark:to-[#09090b] flex items-center justify-center">
        {items.map((item, index) => {
          const diff = p - index;

          if (Math.abs(diff) >= 2.0) {
            return null;
          }

          const isLandscape = item.type === "photo" && item.photo.width > item.photo.height;
          const isFocused = Math.abs(diff) < 0.05;
          const key = item.type === "intro" ? "intro" : item.photo.publicId;

          return (
            <div
              key={key}
              data-key={key}
              ref={(el) => {
                if (el) elMapRef.current.set(key, el);
                else elMapRef.current.delete(key);
              }}
              onClick={(e) => handleCardClick(e, index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation(); // prevent window-level ArrowDown/Space handler from also firing
                  handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>, index);
                }
              }}
              role="button"
              tabIndex={0}
              className={`absolute left-1/2 top-1/2 ${index > 0 ? "cursor-pointer" : ""} will-change-transform select-none ${
                isLandscape
                  ? "w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
                  : "w-[70vw] max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4]"
              }`}
            >
              {item.type === "intro" ? (
                <IntroCard />
              ) : (
                <PhotoCard photo={item.photo} eager={index < 4} isFocused={isFocused} />
              )}
            </div>
          );
        })}

        <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-between text-zinc-500 dark:text-zinc-400 font-mono text-xs select-none pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="text-zinc-700 dark:text-zinc-300">
              <span className="text-zinc-950 dark:text-white font-medium">
                {String(Math.round(p) + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-zinc-400">/</span>
              <span>{String(items.length).padStart(2, "0")}</span>
            </div>
            <div className="relative w-20 sm:w-28 h-[2px] bg-zinc-300/50 dark:bg-zinc-800/55 overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-zinc-950 dark:bg-white"
                style={{ width: `${items.length > 1 ? (p / (items.length - 1)) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <span className="hidden md:inline text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium">
              {Math.abs(p - Math.round(p)) < 0.05
                ? Math.round(p) === 0
                  ? "Scroll down to explore"
                  : "Click photo to open"
                : "Scroll to next image"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 dark:bg-black/25 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/20 dark:hover:bg-black/35 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 dark:bg-black/25 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/20 dark:hover:bg-black/35 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Gallery(props: { photos: PhotoProps[] }): React.JSX.Element {
  return <GalleryInner photos={props.photos} />;
}
