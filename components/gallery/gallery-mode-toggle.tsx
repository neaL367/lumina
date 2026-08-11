"use client";

import { Eye, LayoutGrid } from "lucide-react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";

export function GalleryModeToggle(): React.JSX.Element {
  const { state, actions } = useGalleryContext();

  return (
    <div className="gallery-glass-surface fixed top-[4.5rem] left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 sm:top-5">
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
  );
}
