"use client";

import { ViewTransition } from "react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";
import { FocusedPhotoCard } from "./focused-photo-card";
import { BlurredPhotoCard } from "./blurred-photo-card";
import { getPhotoRoutePath } from "@/utils/photo-paths";
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

  const isFocused = Math.abs(diff) < 0.15;

  const key = getItemKey(item);
  const token = getPhotoRouteToken(item);
  const isLandscape = item.photo.width > item.photo.height;

  const cardClassName = `absolute left-1/2 top-1/2 will-change-transform select-none focus:outline-none ${
    isLandscape
      ? "w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] aspect-[3/2] cursor-pointer"
      : "w-[60vw] max-w-[220px] sm:max-w-[270px] md:max-w-[320px] lg:max-w-[360px] aspect-[3/4] cursor-pointer"
  }`;

  const landscapeSizes = `(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1920px) 35vw, 620px`;
  const portraitSizes = `(max-width: 640px) 60vw, (max-width: 1024px) 30vw, (max-width: 1920px) 20vw, 360px`;

  const divProps = {
    ref: (el: HTMLDivElement | null) => {
      if (el) meta.elMapRef.current.set(key, el);
      else meta.elMapRef.current.delete(key);
    },
    onClick: (e: React.MouseEvent<HTMLDivElement>) => actions.handleCardClick(e, index),
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        actions.handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>, index);
      }
    },
    role: "button" as const,
    tabIndex: 0,
    className: cardClassName,
  };

  const scaleClass = isFocused ? "scale-[1.03] opacity-100" : "scale-[0.96] opacity-60";

  return (
    <ViewTransition key={key} name={`photo-${token}`} share="photo-morph">
      <div key={key} data-key={key} data-gallery-card="true" {...divProps}>
        <div className={`w-full h-full transition-all duration-500 ease-out ${scaleClass}`}>
          {isFocused ? (
            <FocusedPhotoCard photo={item.photo} sizes={isLandscape ? landscapeSizes : portraitSizes} />
          ) : (
            <BlurredPhotoCard photo={item.photo} eager={index < 4} sizes={isLandscape ? landscapeSizes : portraitSizes} />
          )}
        </div>
      </div>
    </ViewTransition>
  );
}
