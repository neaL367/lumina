"use client";

import { ViewTransition } from "react";

function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse ${className}`} />
  );
}

function PillSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse ${className}`} />
  );
}

export function GallerySkeleton() {
  return (
    <div className="relative w-full h-[38400px]">
      {/* Header skeleton */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <PillSkeleton className="h-12 w-36" />
        <div className="flex items-center gap-2">
          <PillSkeleton className="h-10 w-10 rounded-full" />
          <PillSkeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
        <PillSkeleton className="h-10 w-32" />
      </div>

      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-radial from-[#ffffff] to-[#e4e4e7] dark:from-[#1b1b1f] dark:to-[#09090b] flex items-center justify-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4]">
          <CardSkeleton className="w-full h-full" />
        </div>
        <div className="absolute left-1/2 top-1/2 w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
          style={{ transform: "translate3d(calc(25vw - 50%), calc(35vh - 50%), 0) scale(0.85) rotate(2deg)", opacity: 0.25 }}
        >
          <CardSkeleton className="w-full h-full" />
        </div>
        <div className="absolute left-1/2 top-1/2 w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
          style={{ transform: "translate3d(calc(-25vw - 50%), calc(-35vh - 50%), 0) scale(0.85) rotate(-2deg)", opacity: 0.25 }}
        >
          <CardSkeleton className="w-full h-full" />
        </div>
      </div>

      {/* Progress skeleton */}
      <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <PillSkeleton className="h-4 w-12" />
          <PillSkeleton className="h-0.5 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PhotoSkeleton() {
  return (
    <div className="w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950 flex items-center justify-center sm:p-6">
      <div className="relative w-full max-w-5xl mx-auto">
        <ViewTransition share="photo-morph">
          <div className="relative w-full aspect-[3/2] overflow-hidden sm:rounded-3xl rounded-none bg-zinc-200/60 dark:bg-zinc-800/60 p-1.5 sm:p-2 animate-pulse">
            <div className="w-full h-full rounded-2xl" />
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
