"use client";

import { memo } from "react";
import Image from "next/image";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;
  } catch {
    return "";
  }
}

export const FocusedPhotoCard = memo(function FocusedPhotoCard({ photo, sizes }: { photo: PhotoProps; sizes: string }) {
  'use memo'
  const assetPath = getCloudinaryAssetPath(photo.publicId, photo.format);

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full overflow-hidden rounded-2xl border border-zinc-200/20 dark:border-zinc-800/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)]">
        <Image
          alt={`Photo from Neal367's photography collection`}
          loader={cloudinaryLoader}
          src={assetPath}
          fill
          quality={82}
          loading="eager"
          placeholder={photo.blurDataUrl ? "blur" : "empty"}
          blurDataURL={photo.blurDataUrl}
          sizes={sizes}
          style={{ transform: "scale(1.04) translate3d(calc(var(--scroll-diff, 0) * -5px), calc(var(--scroll-diff, 0) * -4px), 0)" }}
          className="object-cover"
        />
      </div>

      {photo.createdAt && (
        <div className="flex justify-center pt-3 opacity-100 translate-y-0 transition-all duration-300">
          <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-mono tracking-wide">
            {formatDate(photo.createdAt)}
          </span>
        </div>
      )}
    </div>
  );
});
