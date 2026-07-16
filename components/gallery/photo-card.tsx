import { memo } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cloudinaryLoader, getCloudinaryAssetPath, getCloudinaryImageUrl } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";

const GALLERY_CARD_SIZES = `(max-width: 640px) 560px, (max-width: 1024px) 700px, 800px`;

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

export const PhotoCard = memo(function PhotoCard(props: { photo: PhotoProps; priority: boolean; isFocused: boolean }): React.JSX.Element {
  const assetPath = getCloudinaryAssetPath(props.photo.publicId, props.photo.format);
  const fullImageUrl = getCloudinaryImageUrl(assetPath);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-3xl bg-[#fcfbf9] dark:bg-[#131316] p-1.5 sm:p-2 border border-zinc-200/30 dark:border-zinc-800/40 transition-all duration-700 ${
      props.isFocused 
        ? "shadow-[0_30px_70px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_35px_80px_-15px_rgba(0,0,0,0.7)]" 
        : "shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.2)]"
    }`}>
      <div className="relative w-full h-full rounded-2xl overflow-hidden transition-transform duration-700 ease-out hover:scale-[1.03]">
        <Image
          alt={`Neal367's photo ${props.photo.createdAt || `unknown time`}`}
          loader={cloudinaryLoader}
          src={assetPath}
          fill
          quality={90}
          loading={props.priority ? `eager` : `lazy`}
          placeholder={props.photo.blurDataUrl ? `blur` : `empty`}
          blurDataURL={props.photo.blurDataUrl}
          sizes={GALLERY_CARD_SIZES}
          style={{ transform: "scale(1.06) translate3d(calc(var(--scroll-diff, 0) * -8px), calc(var(--scroll-diff, 0) * -6px), 0)" }}
          className="object-cover will-change-transform"
          priority={props.priority}
        />
        
        {/* Procedural Film Grain Overlay */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.05] dark:opacity-[0.08] mix-blend-overlay z-10" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Date caption */}
        {props.photo.createdAt && (
          <div className={`absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded bg-black/45 dark:bg-black/65 backdrop-blur-md text-white font-mono text-[8px] tracking-[0.2em] transition-all duration-700 select-none ${
            props.isFocused 
              ? "opacity-100 translate-y-0 scale-100 shadow-sm" 
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          }`}>
            {formatDate(props.photo.createdAt)}
          </div>
        )}

        {/* Open new tab external icon button */}
        <a
          href={fullImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/45 dark:bg-black/65 backdrop-blur-md text-white/95 hover:text-white hover:scale-105 hover:bg-black/60 transition-all duration-700 shadow-sm cursor-pointer select-none ${
            props.isFocused 
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
          aria-label="Open full resolution image in new tab"
        >
          <ExternalLink size={11} className="stroke-[2.5]" />
        </a>
      </div>
    </div>
  );
});
