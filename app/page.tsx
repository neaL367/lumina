import { Suspense } from "react";

import { GallerySkeleton } from "@/components/gallery-skeleton";
import { Gallery } from "@/components/gallery";
import { getPhotos } from "@/lib/photos";

async function GalleryContent() {
  const photos = await getPhotos();
  return <Gallery photos={photos} />;
}

export default function Home() {
  return (
    <main className="w-full h-dvh bg-zinc-50 dark:bg-black">
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent />
      </Suspense>
    </main>
  );
}
