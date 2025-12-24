function IntroSkeleton() {
  return (
    <div className="row-span-1 h-full w-full rounded-2xl flex flex-col justify-start animate-pulse">
      <div className="mb-3 space-y-2">
        <div className="h-4 w-32 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-3 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="h-5 w-5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-5 w-5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

function PhotoSkeleton() {
  return (
    <div className="h-full w-full animate-pulse">
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800 shadow-sm">
        {/* fake image */}
      </div>
    </div>
  );
}

export function GallerySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      <div className="inline-grid grid-rows-4 grid-flow-col gap-4 p-6 auto-cols-[280px] sm:auto-cols-[350px] lg:auto-cols-[400px]">
        <IntroSkeleton />

        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-40 sm:h-48 lg:h-52 block">
            <PhotoSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
