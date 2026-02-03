"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useTransition,
  createContext,
  useMemo,
  use,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLink,
  XIcon,
} from "lucide-react";
import type { CarouselContextType, PhotoProps } from "@/utils/types";
import { useXScroll } from "@/hooks/use-x-scroll";

// --- Context ---

const CarouselContext = createContext<CarouselContextType | null>(null);

function useCarousel() {
  const context = use(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within a Carousel root");
  }
  return context;
}

// --- Utils ---

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const getCloudinaryUrl = (publicId: string, format: string, width: number) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_${width},q_auto,f_auto/${publicId}.${format}`;
};

// --- Sub-components ---

export function CarouselMain() {
  const { currentIndex, photos, loading, setLoading, handleNext, handlePrev } = useCarousel();
  const currentImage = photos[currentIndex];

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  if (!currentImage) return null;

  return (
    <div
      className="relative h-full w-full flex items-center justify-center overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Low-res placeholder */}
      <Image
        key={`low-${currentImage.id}`}
        src={getCloudinaryUrl(currentImage.public_id, currentImage.format, 300)}
        width={300}
        height={200}
        alt=""
        aria-hidden="true"
        className={`max-h-full max-w-full object-contain transition-opacity duration-700 ease-in-out ${loading ? "opacity-100 scale-100 blur-lg" : "opacity-0 scale-95 blur-none"
          }`}
        style={{
          height: "auto",
          width: "auto",
          position: "absolute",
        } as React.CSSProperties}
      />

      {/* High-res image */}
      <Image
        key={currentImage.id}
        src={getCloudinaryUrl(currentImage.public_id, currentImage.format, 1280)}
        width={1280}
        height={853}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
        alt={`Photo ${currentImage.id}`}
        onLoad={() => setLoading(false)}
        className={`max-h-full max-w-full object-contain transition-all duration-700 ease-in-out ${loading ? "opacity-0 scale-95 blur-md" : "opacity-100 scale-100 blur-0"
          }`}
        style={{
          height: "auto",
          width: "auto",
          zIndex: 10,
        } as React.CSSProperties}
      />
    </div>
  );
}

function CarouselNavigation() {
  const { currentIndex, photos, handleNext, handlePrev } = useCarousel();

  return (
    <>
      {currentIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 md:p-4 text-white hover:bg-black/70 transition-colors hover:cursor-pointer"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}

      {currentIndex + 1 < photos.length && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 md:p-4 text-white hover:bg-black/70 transition-colors hover:cursor-pointer"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}
    </>
  );
}

function CarouselThumbnails() {
  const { currentIndex, photos, goToIndex } = useCarousel();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useXScroll(scrollContainerRef, {
    friction: 0.92,
    sensitivity: 1,
  });

  // Scroll active thumbnail into view
  useEffect(() => {
    const activeItem = scrollContainerRef.current?.children[currentIndex] as HTMLElement;
    if (activeItem && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = activeItem.offsetLeft - container.offsetWidth / 2 + activeItem.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-2 px-4 py-4 overflow-x-auto snap-x snap-mandatory w-full items-center [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {photos.map((photo, i) => (
        <button
          key={photo.id}
          onClick={() => goToIndex(i)}
          className={`relative aspect-3/2 h-16 md:h-20 shrink-0 overflow-hidden rounded-md transition-all snap-center ${i === currentIndex
            ? "ring-2 ring-white scale-110 z-10 brightness-110"
            : "brightness-50 hover:brightness-75 hover:cursor-zoom-in"
            }`}
          aria-label={`View photo ${photo.id}`}
        >
          <Image
            src={getCloudinaryUrl(photo.public_id, photo.format, 200)}
            alt="thumbnail"
            fill
            placeholder="blur"
            blurDataURL={photo.blurDataUrl}
            className="object-cover"
            sizes="120px"
          />
        </button>
      ))}
    </div>
  );
}

function CarouselActions() {
  const { currentIndex, photos, closeModal } = useCarousel();
  const currentImage = photos[currentIndex];

  if (!currentImage) return null;

  return (
    <div className="flex items-center gap-3">
      <a
        href={getCloudinaryUrl(currentImage.public_id, currentImage.format, 1920)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-black/50 p-2.5 text-white hover:bg-black/70 transition-colors"
        title="Open full size"
      >
        <ExternalLink className="w-5 h-5" />
      </a>
      <button
        onClick={closeModal}
        className="rounded-full bg-black/50 p-2.5 text-white hover:bg-black/70 transition-colors hover:cursor-pointer"
        aria-label="Close gallery"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

// --- Root Component ---

interface CarouselProps {
  photos: PhotoProps[];
  children?: React.ReactNode;
}

export function Carousel({ photos, children }: CarouselProps) {
  const router = useRouter();
  const params = useParams();

  // Determine current index from URL segment
  const photoId = Array.isArray(params?.id) ? params.id.join("/") : params?.id;
  const urlIndex = photos.findIndex((p) => p.id === photoId);
  const currentIndex = urlIndex !== -1 ? urlIndex : 0;

  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const closeModal = useCallback(() => {
    router.back();
  }, [router]);

  const goToIndex = useCallback(
    (newIndex: number) => {
      if (newIndex === currentIndex) return;

      startTransition(() => {
        setLoading(true);
      });

      router.replace(`/p/${photos[newIndex].id}`, { scroll: false });
    },
    [currentIndex, photos, router]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < photos.length) {
      goToIndex(currentIndex + 1);
    }
  }, [currentIndex, photos.length, goToIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, goToIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev, closeModal]);

  const contextValue = useMemo(
    () => ({
      currentIndex,
      photos,
      loading,
      setLoading,
      handleNext,
      handlePrev,
      closeModal,
      goToIndex,
    }),
    [
      currentIndex,
      photos,
      loading,
      handleNext,
      handlePrev,
      closeModal,
      goToIndex,
    ]
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-2xl overflow-hidden h-screen">
        {/* Actions Header */}
        <div className="absolute top-0 right-0 p-4 md:p-6 z-50 flex justify-end">
          <CarouselActions />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 min-h-0 relative flex items-center justify-center p-4 md:p-8">
          {children || <CarouselMain />}
          <CarouselNavigation />
        </div>

        {/* Thumbnails Workspace */}
        <div className="w-full shrink-0 bg-black/20 border-t border-white/5 pb-2 md:pb-4">
          <CarouselThumbnails />
        </div>
      </div>
    </CarouselContext.Provider>
  );
}
