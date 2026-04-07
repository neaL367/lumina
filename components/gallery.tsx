"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, memo } from "react";
import { Github, Twitter } from "lucide-react";
import { CLOUD_NAME } from "@/utils/constants";

import { useXScroll } from "@/hooks/use-x-scroll";
import type { PhotoProps } from "@/utils/types";

const GALLERY_CARD_SIZES = `(max-width: 640px) 280px, (max-width: 1024px) 350px, 400px`;

const getGalleryImageUrl = (publicId: string, format: string, width: number, quality = `auto`) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_limit,w_${width},dpr_auto,q_${quality},f_auto/${publicId}.${format}`;
};

const IntroCard = memo(function IntroCard(): React.JSX.Element {
  return (
    <div className={`row-span-1 h-full w-full rounded-2xl flex flex-col justify-center`}>
      <div className={`mb-3`}>
        <h1 className={`text-zinc-900 dark:text-white font-medium mb-1`}>
          {`Neal367's photos`}
        </h1>
        <p className={`text-zinc-600 dark:text-zinc-400 text-sm`}>
          {`a collection of my favorite memories.❣️`}
        </p>
      </div>
      <div className={`flex items-center gap-4 mt-2`}>
        <Link
          href={`https://github.com/neal367`}
          target={`_blank`}
          rel={`noopener noreferrer`}
          className={`text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors`}
        >
          <Github className={`w-5 h-5`} />
          <span className={`sr-only`}>{`GitHub`}</span>
        </Link>

        <Link
          href={`https://twitter.com/NL367`}
          target={`_blank`}
          rel={`noopener noreferrer`}
          className={`text-zinc-600 hover:text-blue-400 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors`}
        >
          <Twitter className={`w-5 h-5`} />
          <span className={`sr-only`}>{`Twitter`}</span>
        </Link>
      </div>
    </div>
  );
});


const PhotoCard = memo(function PhotoCard(props: { photo: PhotoProps; priority: boolean }): React.JSX.Element {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  return (
    <div className={`h-full w-full`}>
      <div className={`relative w-full h-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 shadow-sm`}>
        {/* Low-res placeholder */}
        <Image
          alt={``}
          src={getGalleryImageUrl(props.photo.public_id, props.photo.format, 64, `10`)}
          fill
          unoptimized
          loading={props.priority ? `eager` : `lazy`}
          sizes={GALLERY_CARD_SIZES}
          className={`object-cover transition-opacity duration-700 ${isHighResLoaded ? `opacity-0 scale-105` : `opacity-100 scale-100`
            }`}
          aria-hidden={true}
        />

        {/* High-res image */}
        <Image
          alt={`Neal367's photo`}
          src={getGalleryImageUrl(props.photo.public_id, props.photo.format, 1600)}
          fill
          unoptimized
          loading={props.priority ? `eager` : `lazy`}
          onLoad={() => setIsHighResLoaded(true)}
          className={`object-cover transition-all duration-700 ease-in-out hover:scale-[101.5%] hover:brightness-100 will-change-scroll ${isHighResLoaded ? `opacity-100 scale-100 blur-0` : `opacity-0 scale-95 blur-md`
            }`}
          sizes={GALLERY_CARD_SIZES}
          priority={props.priority}
        />
      </div>
    </div>
  );
});

export function Gallery(props: { photos: PhotoProps[] }): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);

  useXScroll(scrollRef, {
    friction: 0.92,
    sensitivity: 0.055,
  });

  return (
    <div
      ref={scrollRef}
      className={`h-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full`}
    >
      <div className={`inline-grid h-full grid-rows-4 grid-flow-col gap-4 p-6 auto-cols-[280px] sm:auto-cols-[350px] lg:auto-cols-[400px] min-h-0`}>
        <IntroCard />

        {props.photos.map((photo, index) => (
          <Link
            key={photo.id}
            href={`/p/${index + 1}`}
            className={`h-full block cursor-zoom-in active:scale-[0.98] transition-all animate-reveal [content-visibility:auto]`}
            style={{ animationDelay: `${(index % 12) * 50}ms` }}
            scroll={false}
          >
            <PhotoCard photo={photo} priority={index < 4} />
          </Link>
        ))}
      </div>
    </div>
  );
}
