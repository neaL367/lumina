import { Suspense } from "react";

import { GallerySkeleton } from "@/components/gallery-skeleton";
import { Gallery } from "@/components/gallery";
import { getPhotos } from "@/lib/cloudinary";

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="w-full h-dvh bg-zinc-50 dark:bg-black">
      <Suspense fallback={<GallerySkeleton />}>
        <Gallery photos={photos} />
      </Suspense>
    </main>
  );
}
