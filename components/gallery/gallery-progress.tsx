"use client";

import { useGalleryContext } from "@/components/gallery/gallery-provider";

export function GalleryProgress() {
  const { state } = useGalleryContext();
  const { p, items } = state;

  return (
    <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-mono text-xs select-none pointer-events-none" style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
      <div className="flex items-center gap-4 pointer-events-auto" style={{ viewTransitionName: "gallery-progress" }}>
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
  );
}
