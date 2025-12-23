"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRef, ViewTransition } from "react";
import { useXScroll } from "@/hooks/use-x-scroll";
import type { PhotoProps } from "@/utils/types";

function PhotoCard({ photos }: { photos: PhotoProps }) {
  const pathname = usePathname();
  const isActive = pathname === `/p/${photos.id}`;

  const isPhotoModalOpen = pathname.startsWith("/p/");

  const content = (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
      <Image
        alt="Next.js Conf photo"
        className="object-cover object-center brightness-90 transition-transform duration-250 hover:scale-[101.5%]"
        style={{ transform: "translate3d(0, 0, 0)" }}
        placeholder="blur"
        blurDataURL={photos.blurDataUrl}
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${photos.public_id}.${photos.format}`}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
      />
    </div>
  );

  if (isActive) {
    return <div className="contents opacity-0">{content}</div>;
  }


  if (isPhotoModalOpen) {
    return <div className="contents">{content}</div>;
  }

  return <ViewTransition name={`photo-${photos.id}`}>{content}</ViewTransition>;
}

export function Gallery({ photos }: { photos: PhotoProps[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useXScroll(scrollRef, {
    friction: 0.92,
    sensitivity: 0.031,
  });

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="inline-grid grid-rows-4 grid-flow-col gap-4 p-6 auto-cols-[280px] sm:auto-cols-[350px] lg:auto-cols-[400px]">
        {/* Intro Card */}
        <div className="row-span-1 h-full w-full rounded-2xl p-6 flex flex-col justify-start">
          <p className="text-zinc-900 dark:text-white">Neal367&apos;s photos</p>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            a collection of my favorite memories.❣️
          </p>
        </div>

        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={`/p/${photo.id}`}
            className="h-40 sm:h-48 lg:h-52 block cursor-zoom-in active:scale-95 transition-all"
            scroll={false}
          >
            <PhotoCard photos={photo} />
          </Link>
        ))}
      </div>
    </div>
  );
}
