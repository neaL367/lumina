"use client";

import Image from "next/image";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";

export function AmbientPhotoBackdrop(): React.JSX.Element | null {
  const { state } = useGalleryContext();
  const currentIndex = Math.min(
    Math.max(Math.round(state.p), 0),
    Math.max(state.items.length - 1, 0)
  );
  const photo = state.items[currentIndex]?.photo;

  if (!photo) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        key={photo.publicId}
        src={getCloudinaryAssetPath(photo.publicId, photo.format)}
        alt=""
        fill
        loader={cloudinaryLoader}
        sizes="100vw"
        quality={20}
        className="scale-110 object-cover opacity-[0.07] blur-3xl dark:opacity-[0.14]"
      />
      <div className="absolute inset-0 bg-white/55 dark:bg-zinc-950/65" />
    </div>
  );
}
