"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";

export function GalleryNavigation(): React.JSX.Element | null {
  const { state, actions } = useGalleryContext();
  if (state.viewMode !== "focus" || state.items.length < 2) return null;

  const currentIndex = Math.min(
    Math.max(Math.round(state.p), 0),
    state.items.length - 1
  );

  const buttonClass = "gallery-glass-surface gallery-glass-control pointer-events-auto flex size-10 items-center justify-center rounded-full opacity-45 hover:scale-105 hover:opacity-100 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="pointer-events-none fixed inset-x-4 top-1/2 z-40 flex -translate-y-1/2 justify-between sm:inset-x-7">
      <button
        type="button"
        onClick={() => actions.selectPhoto(currentIndex - 1)}
        disabled={currentIndex === 0}
        aria-label="Previous memory"
        className={buttonClass}
      >
        <ChevronLeft size={17} />
      </button>
      <button
        type="button"
        onClick={() => actions.selectPhoto(currentIndex + 1)}
        disabled={currentIndex === state.items.length - 1}
        aria-label="Next memory"
        className={buttonClass}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}
