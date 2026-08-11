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

export function FilmstripGallery(): React.JSX.Element {
  const { state, actions } = useGalleryContext();
  const currentIndex = Math.min(
    Math.max(Math.round(state.p), 0),
    Math.max(state.items.length - 1, 0)
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6 sm:px-10">
      <div className="w-full max-w-6xl overflow-hidden">
        <div
          className="flex snap-x snap-mandatory items-center gap-3 overflow-x-auto px-[calc(50%-4rem)] py-8 no-scrollbar sm:gap-5 sm:px-[calc(50%-5rem)]"
          aria-label="Photo filmstrip"
        >
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
                className={`group relative h-28 w-20 shrink-0 snap-center overflow-hidden rounded-xl border transition-all duration-300 sm:h-36 sm:w-24 ${
                  isCurrent
                    ? "scale-110 border-zinc-950 shadow-[0_16px_35px_rgba(0,0,0,0.22)] dark:border-white dark:shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
                    : "border-zinc-200/40 opacity-55 hover:scale-105 hover:opacity-90 dark:border-zinc-800/50"
                }`}
              >
                <Image
                  src={assetPath}
                  alt=""
                  fill
                  loader={cloudinaryLoader}
                  sizes="96px"
                  quality={75}
                  loading={Math.abs(index - currentIndex) < 3 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center font-mono text-[10px] tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
        <span className="text-zinc-900 dark:text-white">{String(currentIndex + 1).padStart(2, "0")}</span>
        <span className="mx-2">/</span>
        <span>{String(state.items.length).padStart(2, "0")}</span>
        {state.items[currentIndex]?.photo.createdAt && (
          <span className="ml-4 tracking-wide">{formatDate(state.items[currentIndex].photo.createdAt)}</span>
        )}
      </div>
    </div>
  );
}
