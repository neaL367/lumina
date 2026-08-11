"use client";

import Image from "next/image";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime())
    ? ""
    : `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;
}

export function OverviewGallery(): React.JSX.Element {
  const { state, actions } = useGalleryContext();
  const currentIndex = Math.min(
    Math.max(Math.round(state.p), 0),
    Math.max(state.items.length - 1, 0)
  );

  return (
    <div className="min-h-dvh w-full px-5 pb-28 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto columns-2 gap-3 sm:columns-3 sm:gap-5 lg:columns-4 xl:max-w-7xl">
        {state.items.map((item, index) => {
          const photo = item.photo;
          const assetPath = getCloudinaryAssetPath(photo.publicId, photo.format);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={photo.publicId}
              type="button"
              onClick={() => actions.selectPhoto(index)}
              aria-label={`Open photo ${index + 1}${photo.createdAt ? ` from ${formatDate(photo.createdAt)}` : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border text-left transition-all duration-500 sm:mb-5 ${
                isCurrent
                  ? "border-zinc-950 shadow-[0_18px_40px_rgba(0,0,0,0.18)] dark:border-white dark:shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
                  : "border-zinc-200/30 opacity-85 hover:scale-[1.015] hover:opacity-100 dark:border-zinc-800/40"
              }`}
              style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            >
              <Image
                src={assetPath}
                alt=""
                fill
                loader={cloudinaryLoader}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={78}
                loading={Math.abs(index - currentIndex) < 3 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              {photo.createdAt && (
                <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[9px] font-mono tracking-wide text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  {formatDate(photo.createdAt)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
