"use client";

import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLink,
  XIcon,
} from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  cloudinaryLoader,
  getCloudinaryAssetPath,
  getCloudinaryImageUrl,
} from "@/lib/cloudinary-images";
import { useXScroll } from "@/hooks/use-x-scroll";
import { useCarousel } from "@/components/carousel-context";
import { PhotoProps } from "@/utils/types";

const CAROUSEL_IMAGE_SIZES = `(max-width: 768px) calc(100vw - 2rem), calc(100vw - 4rem)`;
const THUMBNAIL_WINDOW = 12;

export const CarouselMain = memo(function CarouselMain() {
  const {
    currentIndex,
    photos,
    loading,
    markCurrentImageLoaded,
    handleNext,
    handlePrev,
    direction,
  } = useCarousel();
  const currentImage = photos[currentIndex];

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const onTouchStart = (event: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = event.targetTouches[0].clientX;
  };

  const onTouchMove = (event: React.TouchEvent) => {
    touchEnd.current = event.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
  };

  const lastWheelTime = useRef(0);
  const onWheel = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      if (Math.abs(event.deltaX) > 20) {
        if (event.deltaX > 0) handleNext();
        else handlePrev();
        lastWheelTime.current = now;
      }
    }
  };

  const [prevPhoto, setPrevPhoto] = useState<PhotoProps | null>(null);
  const [lastIndex, setLastIndex] = useState(currentIndex);

  // Sync state during render to capture the photo before it settles.
  // This avoids the "setState in useEffect" lint error and prevents cascading renders.
  if (currentIndex !== lastIndex) {
    setLastIndex(currentIndex);
    setPrevPhoto(photos[lastIndex]);
  }

  useEffect(() => {
    if (!loading && prevPhoto) {
      const timer = setTimeout(() => setPrevPhoto(null), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, prevPhoto]);

  if (!currentImage) return null;

  const currentAssetPath = getCloudinaryAssetPath(currentImage.public_id, currentImage.format);

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      <div className={`relative flex h-full w-full items-center justify-center`}>
        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-t-white border-transparent transition-opacity duration-300" />
            </div>
          </div>
        )}

        {/* Previous Image (Cross-fade background) */}
        {prevPhoto && (
          <Image
            key={`prev-${prevPhoto.id}`}
            loader={cloudinaryLoader}
            src={getCloudinaryAssetPath(prevPhoto.public_id, prevPhoto.format)}
            fill
            priority
            loading="eager"
            placeholder={prevPhoto.blurDataUrl ? `blur` : `empty`}
            blurDataURL={prevPhoto.blurDataUrl}
            sizes={CAROUSEL_IMAGE_SIZES}
            alt=""
            className={`object-contain transition-opacity duration-700 ease-in-out ${loading ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Current Image */}
        <Image
          key={`active-${currentImage.id}`}
          loader={cloudinaryLoader}
          src={currentAssetPath}
          fill
          priority
          loading="eager"
          placeholder={currentImage.blurDataUrl ? `blur` : `empty`}
          blurDataURL={currentImage.blurDataUrl}
          sizes={CAROUSEL_IMAGE_SIZES}
          alt={`Photo ${currentImage.id}`}
          onLoad={() => markCurrentImageLoaded(currentIndex)}
          onError={() => markCurrentImageLoaded(currentIndex)}
          className={`object-contain transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${loading
            ? `opacity-0 scale-[0.98] blur-sm ${direction === `next` ? `translate-x-4` : direction === `prev` ? `-translate-x-4` : ``}`
            : `opacity-100 scale-100 blur-0 translate-x-0`
            }`}
        />
      </div>
    </div>
  );
});

export const CarouselNavigation = memo(function CarouselNavigation() {
  const { currentIndex, photos, handleNext, handlePrev } = useCarousel();

  return (
    <>
      {currentIndex > 0 ? (
        <button
          className={`absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:cursor-pointer hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:p-4`}
          onClick={handlePrev}
          aria-label={`Previous image`}
        >
          <ChevronLeftIcon className={`h-6 w-6 md:h-8 md:w-8`} />
        </button>
      ) : null}

      {currentIndex + 1 < photos.length ? (
        <button
          className={`absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:cursor-pointer hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:p-4`}
          onClick={handleNext}
          aria-label={`Next image`}
        >
          <ChevronRightIcon className={`h-6 w-6 md:h-8 md:w-8`} />
        </button>
      ) : null}
    </>
  );
});

export const CarouselThumbnails = memo(function CarouselThumbnails() {
  const { currentIndex, photos, goToIndex } = useCarousel();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useXScroll(scrollContainerRef, {
    friction: 0.92,
    sensitivity: 0.45,
  });

  const thumbnailWindow = useMemo(() => {
    const startIndex = Math.max(0, currentIndex - THUMBNAIL_WINDOW);
    const endIndex = Math.min(photos.length, currentIndex + THUMBNAIL_WINDOW + 1);

    return photos.slice(startIndex, endIndex).map((photo, offset) => ({
      index: startIndex + offset,
      photo,
    }));
  }, [currentIndex, photos]);

  useEffect(() => {
    const activeThumbnailIndex = thumbnailWindow.findIndex((item) => item.index === currentIndex);
    if (activeThumbnailIndex < 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const activeItem = scrollContainerRef.current?.children[activeThumbnailIndex] as HTMLElement | undefined;
      activeItem?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, thumbnailWindow]);

  return (
    <div
      ref={scrollContainerRef}
      className={`flex w-full items-center gap-4 overflow-x-auto px-[calc(50%-3rem)] py-4 snap-x snap-mandatory md:px-[calc(50%-3.75rem)] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600/50 [&::-webkit-scrollbar-track]:bg-zinc-900/50`}
    >
      {thumbnailWindow.map(({ index, photo }) => (
        <button
          key={photo.id}
          onClick={() => goToIndex(index)}
          className={`relative aspect-3/2 h-16 shrink-0 snap-center overflow-hidden rounded-md transition-[filter,transform,box-shadow] md:h-20 ${index === currentIndex
            ? `z-10 scale-110 brightness-110 ring-2 ring-white`
            : `brightness-50 hover:cursor-zoom-in hover:brightness-75`
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
          aria-label={`View photo ${index + 1}`}
        >
          <Image
            loader={cloudinaryLoader}
            src={getCloudinaryAssetPath(photo.public_id, photo.format)}
            alt=""
            fill
            placeholder={photo.blurDataUrl ? `blur` : `empty`}
            blurDataURL={photo.blurDataUrl}
            className={`object-cover`}
            sizes={`120px`}
          />
        </button>
      ))}
    </div>
  );
});

export const CarouselActions = memo(function CarouselActions() {
  const { currentIndex, photos, closeModal } = useCarousel();
  const currentImage = photos[currentIndex];

  if (!currentImage) {
    return null;
  }

  const fullSizeUrl = getCloudinaryImageUrl(
    getCloudinaryAssetPath(currentImage.public_id, currentImage.format),
    {
      width: 2560,
    }
  );

  return (
    <div className={`flex items-center gap-3`}>
      <div className={`flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3.5 text-xs font-medium text-white/70 tabular-nums backdrop-blur-md`}>
        <span>{currentIndex + 1}</span>
        <span className={`opacity-40`}>/</span>
        <span>{photos.length}</span>
      </div>
      <a
        href={fullSizeUrl}
        target={`_blank`}
        rel={`noreferrer`}
        className={`rounded-full bg-black/50 p-2.5 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
        title={`Open full size`}
        aria-label={`Open full size`}
      >
        <ExternalLink className={`h-5 w-5`} />
      </a>
      <button
        onClick={closeModal}
        className={`flex h-10 items-center gap-2 rounded-full bg-black/50 p-2.5 px-3.5 text-white transition-colors hover:cursor-pointer hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
        aria-label={`Close gallery`}
      >
        <XIcon className={`h-5 w-5`} />
        <span className={`hidden pr-1 text-sm font-medium md:inline`}>Close</span>
      </button>
    </div>
  );
});
