"use client";

import { memo } from "react";
import Image from "next/image";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";

export const BlurredPhotoCard = memo(function BlurredPhotoCard({ photo, eager, sizes }: { photo: PhotoProps; eager?: boolean; sizes: string }) {
  'use memo'
  const assetPath = getCloudinaryAssetPath(photo.publicId, photo.format);

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full overflow-hidden rounded-2xl border border-zinc-200/20 dark:border-zinc-800/35 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_45px_-15px_rgba(0,0,0,0.25)]">
        <Image
          alt={`Photo from Neal367's photography collection`}
          loader={cloudinaryLoader}
          src={assetPath}
          fill
          quality={82}
          loading={eager ? "eager" : "lazy"}
          placeholder={photo.blurDataUrl ? "blur" : "empty"}
          blurDataURL={photo.blurDataUrl}
          sizes={sizes}
          style={{ transform: "scale(1.04) translate3d(calc(var(--scroll-diff, 0) * -5px), calc(var(--scroll-diff, 0) * -4px), 0)" }}
          className="object-cover"
        />
      </div>
    </div>
  );
});
