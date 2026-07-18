"use client";

import type { PhotoProps } from "@/utils/types";
import { GalleryProvider, CARD_SPACING_PX } from "@/components/gallery/gallery-provider";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { GalleryCard } from "./gallery-card";
import { GalleryFilter } from "./gallery-filter";
import { GalleryProgress } from "./gallery-progress";

function GalleryInner(): React.JSX.Element {
  const { state, meta, actions } = useGalleryContext();
  const { p, items, isReady } = state;
  const { scrollContainerRef } = meta;
  const { handleScroll } = actions;

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="gallery-scroll-container relative w-full h-dvh overflow-y-auto snap-y snap-mandatory no-scrollbar focus:outline-none"
      style={{ visibility: isReady ? "visible" : "hidden", touchAction: "manipulation" }}
    >
      {/* Invisible Snap Points */}
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

      {/* Floating Date Filter Pill */}
      <GalleryFilter />

      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-radial from-[#ffffff] to-[#e4e4e7] dark:from-[#1b1b1f] dark:to-[#09090b] flex items-center justify-center">
        {items.map((item, index) => {
          const diff = p - index;

          if (Math.abs(diff) >= 3.0) {
            return null;
          }

          return (
            <GalleryCard key={item.photo.publicId} item={item} index={index} diff={diff} />
          );
        })}

        <GalleryProgress />
      </div>
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
