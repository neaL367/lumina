"use client";

import { Eye, LayoutGrid } from "lucide-react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { GalleryFilter } from "./gallery-filter";

export function GalleryHeaderControls(): React.JSX.Element {
  const { state, actions } = useGalleryContext();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[51] h-16">
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <div />
        <div className="gallery-glass-surface pointer-events-auto flex items-center gap-1 rounded-full p-1">
          <button
            type="button"
            onClick={() => actions.setViewMode("focus")}
            aria-pressed={state.viewMode === "focus"}
            className={`gallery-glass-control flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${state.viewMode === "focus" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : ""}`}
          >
            <Eye size={11} /> Focus
          </button>
          <button
            type="button"
            onClick={() => actions.setViewMode("overview")}
            aria-pressed={state.viewMode === "overview"}
            className={`gallery-glass-control flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${state.viewMode === "overview" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : ""}`}
          >
            <LayoutGrid size={11} /> Archive
          </button>
        </div>
        <div className="pointer-events-auto flex justify-end">
          <GalleryFilter />
        </div>
      </div>
    </div>
  );
}
