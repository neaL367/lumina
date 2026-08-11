"use client";

import { Eye, LayoutGrid } from "lucide-react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";

export function GalleryModeToggle(): React.JSX.Element {
  const { state, actions } = useGalleryContext();

  return (
    <div className="fixed top-[4.5rem] left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-zinc-200/50 bg-white/65 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/65 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] sm:top-5">
      <button
        type="button"
        onClick={() => actions.setViewMode("focus")}
        aria-pressed={state.viewMode === "focus"}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors ${state.viewMode === "focus" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"}`}
      >
        <Eye size={11} /> Focus
      </button>
      <button
        type="button"
        onClick={() => actions.setViewMode("overview")}
        aria-pressed={state.viewMode === "overview"}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors ${state.viewMode === "overview" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"}`}
      >
        <LayoutGrid size={11} /> Archive
      </button>
    </div>
  );
}
