"use client";

import { useCallback, useMemo, useRef } from "react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function GalleryProgress() {
  const { state, actions } = useGalleryContext();
  const { p, items } = state;
  const timelineRef = useRef<HTMLDivElement>(null);
  const currentIndex = Math.min(Math.max(Math.round(p), 0), Math.max(items.length - 1, 0));
  const progress = items.length > 1
    ? Math.min(100, Math.max(0, (p / (items.length - 1)) * 100))
    : 0;

  const dateMarkers = useMemo(() => {
    const seen = new Set<string>();
    return items.flatMap((item, index) => {
      if (!item.photo.createdAt) return [];
      const date = new Date(item.photo.createdAt);
      if (Number.isNaN(date.getTime())) return [];
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [{
        index,
        label: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
        position: items.length > 1 ? (index / (items.length - 1)) * 100 : 0,
      }];
    });
  }, [items]);

  const selectTimelinePosition = useCallback((clientX: number) => {
    const element = timelineRef.current;
    if (!element || items.length < 2) return;
    const rect = element.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    actions.selectPhoto(Math.round(ratio * (items.length - 1)));
  }, [actions, items.length]);

  const handleTimelineKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      actions.selectPhoto(currentIndex - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      actions.selectPhoto(currentIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      actions.selectPhoto(0);
    } else if (event.key === "End") {
      event.preventDefault();
      actions.selectPhoto(items.length - 1);
    }
  };

  if (state.viewMode === "overview") return null;

  return (
    <div
      className="fixed bottom-7 left-5 right-5 z-40 flex items-center justify-center text-zinc-500 dark:text-zinc-400 select-none pointer-events-none sm:bottom-8"
      style={{ bottom: "calc(1.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex w-full max-w-2xl items-end gap-4 pointer-events-auto" style={{ viewTransitionName: "gallery-progress" }}>
        <div className="shrink-0 font-mono text-xs text-zinc-700 dark:text-zinc-300">
          <span className="font-medium text-zinc-950 dark:text-white">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="mx-1.5 text-zinc-400">/</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>

        <div className="relative flex-1 pb-1">
          <div className="absolute -top-4 left-0 right-0 hidden h-3 sm:block" aria-hidden="true">
            {dateMarkers.map((marker) => (
              <span
                key={`${marker.label}-${marker.index}`}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[8px] font-mono tracking-wide text-zinc-400 dark:text-zinc-600"
                style={{ left: `${marker.position}%` }}
              >
                {marker.label}
              </span>
            ))}
          </div>

          <div
            ref={timelineRef}
            role="slider"
            tabIndex={0}
            aria-label={`Memory ${currentIndex + 1} of ${items.length}`}
            aria-valuemin={1}
            aria-valuemax={items.length}
            aria-valuenow={currentIndex + 1}
            onClick={(event) => selectTimelinePosition(event.clientX)}
            onKeyDown={handleTimelineKeyDown}
            className="group relative h-5 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60"
          >
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-zinc-300/60 dark:bg-zinc-800/70" />
            <div
              className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-zinc-950 dark:bg-white"
              style={{ width: `${progress}%` }}
            />
            {dateMarkers.map((marker) => (
              <button
                key={`mark-${marker.label}-${marker.index}`}
                type="button"
                aria-label={`Jump to ${marker.label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  actions.selectPhoto(marker.index);
                }}
                className="absolute left-0 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-400 transition-all hover:size-2 hover:bg-zinc-950 dark:bg-zinc-600 dark:hover:bg-white"
                style={{ left: `${marker.position}%` }}
              />
            ))}
            <div
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 shadow-[0_0_0_2px_rgba(243,243,243,0.9)] transition-[left] duration-100 dark:bg-white dark:shadow-[0_0_0_2px_rgba(9,9,11,0.9)]"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
