import { Suspense, ViewTransition } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  getCloudinaryAssetPath,
  getCloudinaryImageUrl,
} from "@/lib/cloudinary-images";
import { getPhotoByRouteParam } from "@/lib/photos";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { PhotoSkeleton } from "@/components/gallery-skeleton";
import { getPhotoRoutePath } from "@/utils/photo-paths";
import type { PhotoProps } from "@/utils/types";

async function PhotoContent({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const joinedId = id.join("/");
  return <PhotoContentInner id={joinedId} />;
}

async function PhotoContentInner({ id }: { id: string }) {
  "use cache";
  cacheLife({
    stale: 3600,
    revalidate: 900,
    expire: 86400,
  });

  const photo = await getPhotoByRouteParam(id);

  if (!photo) {
    notFound();
  }

  return <PhotoDisplay photo={photo} />;
}

function PhotoDisplay({ photo }: { photo: PhotoProps }) {
  const isLandscape = photo.width > photo.height;
  const assetPath = getCloudinaryAssetPath(photo.publicId, photo.format);
  const fullImageUrl = getCloudinaryImageUrl(assetPath, {
    quality: 100,
    fit: "scale",
  });

  return (
    <div className="w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950 flex items-center justify-center sm:p-6 relative">
      <Link
        href="/"
        scroll={false}
        transitionTypes={["nav-back"]}
        className="fixed top-6 left-6 z-50 p-3.5 rounded-full bg-white/10 dark:bg-black/25 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/20 dark:hover:bg-black/35 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm"
        aria-label="Back to gallery"
      >
        <ArrowLeft size={18} />
      </Link>
      <a
        href={fullImageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 p-3.5 rounded-full bg-white/10 dark:bg-black/25 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/20 dark:hover:bg-black/35 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm"
        aria-label="Open full resolution image in new tab"
      >
        <ExternalLink size={18} />
      </a>
      <div className="relative w-full max-w-5xl mx-auto">
        <ViewTransition
          name={`photo-${getPhotoRoutePath(photo.publicId)}`}
          share="photo-morph"
        >
          <div
            className={`relative overflow-hidden w-full sm:rounded-3xl rounded-none border-y sm:border border-zinc-200/20 dark:border-zinc-800/35 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.22)] dark:shadow-[0_35px_80px_-15px_rgba(0,0,0,0.65)] ${
              isLandscape ? "aspect-[3/2]" : "aspect-[3/4] max-w-lg mx-auto"
            }`}
          >
            <CloudinaryImage photo={photo} eager />
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}

export default function PhotoPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <ViewTransition enter="page-enter" exit="page-exit duration-100">
          <PhotoSkeleton />{" "}
        </ViewTransition>
      }
    >
      <ViewTransition enter="page-enter" exit="page-exit duration-100" default="none">
        <PhotoContent params={params} />
      </ViewTransition>
    </Suspense>
  );
}
