"use client";

import { useGalleryContext } from "@/components/gallery/gallery-provider";

export function GalleryProgress() {
  const { state, actions } = useGalleryContext();
  const { p, items, viewMode } = state;
  const progress = items.length > 1
    ? Math.min(100, Math.max(0, (p / (items.length - 1)) * 100))
    : 0;

  return (
    <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-mono text-xs select-none pointer-events-none" style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
      <div className="flex items-center gap-4 pointer-events-auto" style={{ viewTransitionName: "gallery-progress" }}>
        <div className="flex items-center gap-1 rounded-full border border-zinc-200/50 bg-white/50 p-1 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/50">
          <button
            type="button"
            onClick={() => actions.setViewMode("focus")}
            aria-pressed={viewMode === "focus"}
            className={`rounded-full px-2 py-1 text-[8px] tracking-[0.15em] transition-colors ${viewMode === "focus" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"}`}
          >
            FOCUS
          </button>
          <button
            type="button"
            onClick={() => actions.setViewMode("overview")}
            aria-pressed={viewMode === "overview"}
            className={`rounded-full px-2 py-1 text-[8px] tracking-[0.15em] transition-colors ${viewMode === "overview" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"}`}
          >
            ARCHIVE
          </button>
        </div>
        <div className="text-zinc-700 dark:text-zinc-300">
          <span className="text-zinc-950 dark:text-white font-medium">
            {String(Math.round(p) + 1).padStart(2, "0")}
          </span>
          <span className="mx-2 text-zinc-400">/</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="relative w-20 sm:w-28 h-[2px] bg-zinc-300/50 dark:bg-zinc-800/55 rounded-full" role="img" aria-label={`Memory ${Math.round(p) + 1} of ${items.length}`}>
          <div
            className="absolute top-0 left-0 h-full bg-zinc-950 dark:bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 dark:bg-white shadow-[0_0_0_2px_rgba(243,243,243,0.8)] dark:shadow-[0_0_0_2px_rgba(9,9,11,0.8)]"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
