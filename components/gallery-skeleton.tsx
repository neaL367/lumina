function IntroSkeleton() {
  return (
    <div className="row-span-1 h-full w-full rounded-2xl flex flex-col justify-center animate-pulse">
      <div className="mb-3 space-y-2">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-48 rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function PhotoSkeleton() {
  return (
    <div className="h-full w-full animate-pulse">
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 shadow-sm" />
    </div>
  );
}

export function GallerySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="h-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-1.5">
      <div className="inline-grid h-full grid-rows-4 grid-flow-col gap-4 p-6 auto-cols-[280px] sm:auto-cols-[350px] lg:auto-cols-[400px] min-h-0 opacity-50">
        <IntroSkeleton />

        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-full block">
            <PhotoSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
