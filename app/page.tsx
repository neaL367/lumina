import { Suspense, ViewTransition } from "react";
import { cacheLife } from "next/cache";
import { Gallery } from "@/components/gallery/gallery";
import { getPhotos } from "@/lib/photos";
import { GallerySkeleton } from "@/components/gallery-skeleton";

async function GalleryContent() {
  "use cache";
  cacheLife({
    stale: 3600,
    revalidate: 900,
    expire: 86400,
  });

  const photos = await getPhotos(true);

  return <Gallery photos={photos} />;
}

export default async function Home(): Promise<React.JSX.Element> {
  return (
    <main className="w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950">
      <ViewTransition
        exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
        enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
        default="none"
      >
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryContent />
        </Suspense>
      </ViewTransition>
    </main>
  );
}
