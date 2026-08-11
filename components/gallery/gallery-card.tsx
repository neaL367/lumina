"use client";

import Link from "next/link";
import { useRef } from "react";
import { ViewTransition } from "react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { FocusedPhotoCard } from "./focused-photo-card";
import { BlurredPhotoCard } from "./blurred-photo-card";
import { getPhotoHref, getPhotoRoutePath } from "@/utils/photo-paths";
import type { PhotoProps } from "@/utils/types";

function getItemKey(item: { type: "photo"; photo: PhotoProps }): string {
  return item.photo.publicId;
}

function getPhotoRouteToken(item: { type: "photo"; photo: PhotoProps }): string {
  return getPhotoRoutePath(item.photo.publicId);
}

export function GalleryCard(
  { item, index, diff }: {
    item: { type: "photo"; photo: PhotoProps };
    index: number;
    diff: number;
  }
) {
  const { actions, meta } = useGalleryContext();
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const isFocused = Math.abs(diff) < 0.15;

  const key = getItemKey(item);
  const token = getPhotoRouteToken(item);
  const isLandscape = item.photo.width > item.photo.height;

  // Positioned element the scroll-driven rAF loop transforms (elMap target).
  const cardClassName = `absolute left-1/2 top-1/2 will-change-transform select-none ${
    isLandscape
      ? "w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2]"
      : "w-[60vw] max-w-[220px] sm:max-w-[270px] md:max-w-[320px] lg:max-w-[360px] aspect-[3/4]"
  }`;

  const landscapeSizes = `(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1920px) 35vw, 620px`;
  const portraitSizes = `(max-width: 640px) 60vw, (max-width: 1024px) 30vw, (max-width: 1920px) 20vw, 360px`;

  const scaleClass = isFocused ? "scale-[1.03] opacity-100" : "scale-[0.96] opacity-60";

  /**
   * Enter/Space on a card. Unfocused cards align into place instead of
   * navigating; focused cards navigate (via the Link, which also fires the
   * onClick path). On the focus-restore div, activation is forwarded to the
   * Link with a synthetic click.
   */
  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.stopPropagation();
    if (!isFocused) {
      // Unfocused card: align it instead of navigating.
      e.preventDefault();
      actions.handleCardClick(e as unknown as React.MouseEvent<HTMLElement>, index);
    } else if (e.currentTarget.tagName !== "A") {
      // Focus on the positioning div (scroll-restore path): forward to the Link.
      e.preventDefault();
      linkRef.current?.click();
    }
    // Focused Link: allow the default activation (fires onClick → navigate).
  };

  return (
    <ViewTransition key={key} name={`photo-${token}`} share="photo-morph">
      <div
        key={key}
        data-key={key}
        data-gallery-card="true"
        ref={(el) => {
          if (el) meta.elMapRef.current.set(key, el);
          else meta.elMapRef.current.delete(key);
        }}
        tabIndex={-1}
        onKeyDown={handleCardKeyDown}
        className={cardClassName}
      >
        <Link
          ref={linkRef}
          href={getPhotoHref(item.photo.publicId)}
          prefetch={true}
          scroll={false}
          transitionTypes={["nav-forward"]}
          data-gallery-card="true"
          onClick={(e) => actions.handleCardClick(e, index)}
          onKeyDown={handleCardKeyDown}
          className="block w-full h-full cursor-pointer focus:outline-none"
        >
          <div className={`w-full h-full transition-all duration-500 ease-out ${scaleClass}`}>
            {isFocused ? (
              <FocusedPhotoCard photo={item.photo} sizes={isLandscape ? landscapeSizes : portraitSizes} />
            ) : (
              <BlurredPhotoCard photo={item.photo} eager={index < 4} sizes={isLandscape ? landscapeSizes : portraitSizes} />
            )}
          </div>
        </Link>
      </div>
    </ViewTransition>
  );
}
