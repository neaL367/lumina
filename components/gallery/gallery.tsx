"use client";

import { ViewTransition } from "react";
import type { PhotoProps } from "@/utils/types";
import { IntroCard } from "./intro-card";
import { PhotoCard } from "./photo-card";
import { useGallery, CARD_SPACING_PX } from "@/hooks/use-gallery";
import { GalleryFilter } from "./gallery-filter";
import { getPhotoRoutePath } from "@/utils/photo-paths";

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
    isReady,
  } = useGallery(photos);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="relative w-full h-dvh overflow-y-auto snap-y snap-mandatory no-scrollbar"
      style={{ visibility: isReady ? "visible" : "hidden" }}
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

          if (item.type === "intro") {
            return (
              <div
                key={key}
                data-key={key}
                data-gallery-card="true"
                ref={(el) => {
                  if (el) elMapRef.current.set(key, el);
                  else elMapRef.current.delete(key);
                }}
                onClick={(e) => handleCardClick(e, index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>, index);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`absolute left-1/2 top-1/2 will-change-transform select-none ${
                  isLandscape
                    ? "w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
                    : "w-[70vw] max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4]"
                }`}
              >
                <IntroCard />
              </div>
            );
          }

          return (
            <ViewTransition key={key} name={`photo-${getPhotoRoutePath(item.photo.publicId)}`} share="photo-morph">
              <div
                key={key}
                data-key={key}
                data-gallery-card="true"
                ref={(el) => {
                  if (el) elMapRef.current.set(key, el);
                  else elMapRef.current.delete(key);
                }}
                onClick={(e) => handleCardClick(e, index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>, index);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`absolute left-1/2 top-1/2 cursor-pointer will-change-transform select-none ${
                  isLandscape
                    ? "w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
                    : "w-[60vw] max-w-[220px] sm:max-w-[270px] md:max-w-[320px] lg:max-w-[360px] aspect-[3/4]"
                }`}
              >
                <PhotoCard photo={item.photo} eager={isFocused || index < 4} isFocused={isFocused} sizes={isLandscape ? `(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1920px) 35vw, 620px` : `(max-width: 640px) 60vw, (max-width: 1024px) 30vw, (max-width: 1920px) 20vw, 360px`} />
              </div>
            </ViewTransition>
          );
        })}

        <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-mono text-xs select-none pointer-events-none">
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


        </div>
      </div>
    </div>
  );
}

export function Gallery(props: { photos: PhotoProps[] }): React.JSX.Element {
  return <GalleryInner photos={props.photos} />;
}
