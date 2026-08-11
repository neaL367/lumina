import { cacheLife } from "next/cache";
import { Gallery } from "@/components/gallery/gallery";
import { getPhotos } from "@/features/photos/photos-queries";

export async function GalleryContent(): Promise<React.JSX.Element> {
  "use cache";
  cacheLife({
    stale: 3600,
    revalidate: 900,
    expire: 86400,
  });

  return <Gallery photos={await getPhotos(true)} />;
}

export function GalleryContentSkeleton(): React.JSX.Element {
  return (
    <div className="relative w-full h-[38400px]">
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <div className="h-12 w-36 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
        </div>
      </div>

      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
        <div className="h-10 w-32 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
      </div>

      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-radial from-[#ffffff] to-[#e4e4e7] dark:from-[#1b1b1f] dark:to-[#09090b] flex items-center justify-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4]">
          <GallerySkeletonCard className="w-full h-full" />
        </div>
        <div
          className="absolute left-1/2 top-1/2 w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
          style={{ transform: "translate3d(calc(25vw - 50%), calc(35vh - 50%), 0) scale(0.85) rotate(2deg)", opacity: 0.25 }}
        >
          <GallerySkeletonCard className="w-full h-full" />
        </div>
        <div
          className="absolute left-1/2 top-1/2 w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
          style={{ transform: "translate3d(calc(-25vw - 50%), calc(-35vh - 50%), 0) scale(0.85) rotate(-2deg)", opacity: 0.25 }}
        >
          <GallerySkeletonCard className="w-full h-full" />
        </div>
      </div>

      <div className="fixed bottom-8 left-8 right-8 z-40 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="h-4 w-12 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
          <div className="h-0.5 w-24 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function GallerySkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse ${className}`} />
  );
}
