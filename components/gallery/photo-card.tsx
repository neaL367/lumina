import { memo, ViewTransition } from "react";
import Image from "next/image";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";

const GALLERY_CARD_SIZES = `(max-width: 640px) 560px, (max-width: 1024px) 700px, (max-width: 1920px) 1200px, 1600px`;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  } catch {
    return "";
  }
}

export const PhotoCard = memo(function PhotoCard({ photo, eager, isFocused }: { photo: PhotoProps; eager: boolean; isFocused: boolean }): React.JSX.Element {
  'use memo'
  const assetPath = getCloudinaryAssetPath(photo.publicId, photo.format);

  return (
    <ViewTransition name={`photo-${photo.publicId}`} share="photo-morph">
      <div
        className={`relative w-full h-full overflow-hidden rounded-2xl border border-zinc-200/20 dark:border-zinc-800/35 transition-all duration-500 ease-out ${
          isFocused
            ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] scale-[1.03] opacity-100"
            : "shadow-[0_10px_35px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_45px_-15px_rgba(0,0,0,0.25)] scale-[0.96] opacity-60"
        }`}
      >
        <Image
          alt={`Photo from Neal367's photography collection`}
          loader={cloudinaryLoader}
          src={assetPath}
          fill
          quality={90}
          loading={eager ? `eager` : `lazy`}
          placeholder={photo.blurDataUrl ? `blur` : `empty`}
          blurDataURL={photo.blurDataUrl}
          sizes={GALLERY_CARD_SIZES}
          style={{ transform: "scale(1.04) translate3d(calc(var(--scroll-diff, 0) * -5px), calc(var(--scroll-diff, 0) * -4px), 0)" }}
          className="object-cover"
        />

        {/* Date caption */}
        {photo.createdAt && (
          <div className={`absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/40 dark:bg-black/60 backdrop-blur-md text-white font-mono text-[9px] tracking-[0.2em] transition-all duration-300 select-none ${
            isFocused 
              ? "opacity-100 translate-y-0 scale-100 shadow-sm" 
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          }`}>
            {formatDate(photo.createdAt)}
          </div>
        )}
      </div>
    </ViewTransition>
  );
});
