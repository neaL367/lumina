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
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => actions.setViewMode("focus")}
            aria-pressed={state.viewMode === "focus"}
            className={`gallery-glass-control flex items-center gap-1.5 border-b-2 px-1 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] ${state.viewMode === "focus" ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white" : "border-transparent"}`} 
          >
            <Eye size={11} /> Focus
          </button>
          <button
            type="button"
            onClick={() => actions.setViewMode("overview")}
            aria-pressed={state.viewMode === "overview"}
            className={`gallery-glass-control flex items-center gap-1.5 border-b-2 px-1 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] ${state.viewMode === "overview" ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white" : "border-transparent"}`} 
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
