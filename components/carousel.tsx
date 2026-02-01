"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  startTransition,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLink,
  XIcon,
} from "lucide-react";
import type { PhotoProps } from "@/utils/types";

interface CarouselProps {
  index: number;
  currentPhoto: PhotoProps;
  photos: PhotoProps[];
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const getCloudinaryUrl = (publicId: string, format: string, width: number) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_${width}/${publicId}.${format}`;
};

export function Carousel({
  index,
  currentPhoto,
  photos,
}: CarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(index);
  const [, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  const changePhotoId = useCallback(
    (newIndex: number) => {
      if (newIndex > currentIndex) {
        setDirection(1);
      } else {
        setDirection(-1);
      }

      startTransition(() => {
        setCurrentIndex(newIndex);
        setLoading(true);
      });

      router.replace(`/p/${photos[newIndex].id}`, { scroll: false });
    },
    [currentIndex, photos, router]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < photos.length) {
      changePhotoId(currentIndex + 1);
    }
  }, [currentIndex, photos.length, changePhotoId]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      changePhotoId(currentIndex - 1);
    }
  }, [currentIndex, changePhotoId]);

  const closeModal = useCallback(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.back();
      });
    } else {
      router.back();
    }
  }, [router]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev, closeModal]);

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

  const currentImage = photos[currentIndex] || currentPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-lg">
      <div
        className="absolute inset-0 z-0 cursor-default"
        onClick={closeModal}
      />

      <div
        className="relative z-10 md:aspect-2/1 w-full max-w-7xl overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative h-full w-full flex items-center justify-center">
          <Image
            src={getCloudinaryUrl(
              currentImage.public_id,
              currentImage.format,
              1280
            )}
            width={1280}
            height={853}
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            alt={`Photo ${currentImage.id}`}
            onLoad={() => setLoading(false)}
            className={`max-h-full max-w-full object-contain transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"
              }`}
          />
        </div>

        {currentIndex > 0 && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-800/80 p-1.5 md:p-3 text-white transition hover:cursor-pointer hover:bg-zinc-600/80"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
        )}

        {currentIndex + 1 < photos.length && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-800/80 p-1.5 md:p-3 text-white transition hover:cursor-pointer hover:bg-zinc-600/80"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <a
            href={getCloudinaryUrl(
              currentImage.public_id,
              currentImage.format,
              1920
            )}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-zinc-800/80 p-2 text-white transition hover:bg-zinc-600/80"
            title="Open full size"
          >
            <ExternalLink className="p-0.5" />
          </a>
          <button
            onClick={closeModal}
            className="rounded-full bg-zinc-800/80 p-2 text-white transition hover:bg-zinc-600/80 hover:cursor-pointer"
            aria-label="Close gallery"
          >
            <XIcon />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden pt-6 pb-4">
        <div className="relative h-14 w-full">
          <div
            className="absolute left-1/2 flex gap-2 will-change-transform"
            style={{
              transform: `translateX(calc(-${currentIndex * (80 + 16) + 40
                }px))`,
            }}
          >
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => changePhotoId(i)}
                className={`relative aspect-3/2 h-12 w-20 shrink-0 overflow-hidden rounded-sm ${i === currentIndex
                  ? "z-10 scale-125 brightness-110 "
                  : "brightness-50 contrast-125 hover:brightness-75"
                  }`}
                aria-label={`View photo ${photo.id}`}
              >
                <Image
                  src={getCloudinaryUrl(photo.public_id, photo.format, 100)}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
