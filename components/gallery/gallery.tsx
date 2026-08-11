"use client";

import type { PhotoProps } from "@/utils/types";
import { GalleryProvider, CARD_SPACING_PX } from "@/components/gallery/gallery-provider";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { OverviewGallery } from "@/features/gallery/components/overview-gallery";
import { GalleryCard } from "./gallery-card";
import { GalleryFilter } from "./gallery-filter";
import { GalleryProgress } from "./gallery-progress";
import { GalleryNavigation } from "./gallery-navigation";
import { AmbientPhotoBackdrop } from "./ambient-photo-backdrop";
import { GalleryModeToggle } from "./gallery-mode-toggle";

function GalleryInner(): React.JSX.Element {
  const { state, meta, actions } = useGalleryContext();
  const { p, items, isReady, viewMode } = state;
  const { scrollContainerRef } = meta;
  const { handleScroll } = actions;
  const isFocusMode = viewMode === "focus";
  const focusedIndex = Math.round(p);
  const maxWindowStart = Math.max(items.length - 3, 0);
  const windowStart = Math.min(Math.max(focusedIndex - 1, 0), maxWindowStart);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={`gallery-scroll-container relative w-full h-dvh no-scrollbar focus:outline-none ${
        isFocusMode ? "overflow-y-auto snap-y snap-mandatory" : "overflow-y-auto"
      }`}
      style={{ visibility: isReady ? "visible" : "hidden", touchAction: "manipulation" }}
    >
      {isFocusMode && (
        <div
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{ height: meta.vh ? `${(items.length - 1) * CARD_SPACING_PX + meta.vh}px` : `${items.length * 100}vh` }}
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
      )}

      <GalleryFilter />
      <GalleryModeToggle />
      <GalleryNavigation />

      {viewMode === "focus" && (
        <div className="sticky top-0 h-dvh w-full overflow-hidden bg-radial from-[#ffffff] to-[#e4e4e7] dark:from-[#1b1b1f] dark:to-[#09090b] flex items-center justify-center">
          <AmbientPhotoBackdrop />
          {items.map((item, index) => {
            if (index < windowStart || index > windowStart + 2) {
              return null;
            }

            return (
              <GalleryCard
                key={item.photo.publicId}
                item={item}
                index={index}
                diff={p - index}
              />
            );
          })}
        </div>
      )}

      {viewMode === "overview" && <OverviewGallery />}

      <GalleryProgress />
    </div>
  );
}

export function Gallery(props: { photos: PhotoProps[] }): React.JSX.Element {
  return (
    <GalleryProvider photos={props.photos}>
      <GalleryInner />
    </GalleryProvider>
  );
}
