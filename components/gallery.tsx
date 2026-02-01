"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
import { Github, Twitter } from "lucide-react";

import { useXScroll } from "@/hooks/use-x-scroll";
import type { PhotoProps } from "@/utils/types";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function PhotoCard({ photo }: { photo: PhotoProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const isActive = pathname === `/p/${photo.id}`;

  return (
    <div
      className={`h-full w-full transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-white dark:bg-zinc-900 shadow-sm ">
        <Image
          alt="Neal367's photo"
          className={`object-cover object-center transition-all duration-500 ease-in-out hover:scale-[101.5%] hover:brightness-100 will-change-scroll
            ${isLoading
              ? "scale-105 blur-lg grayscale"
              : "scale-100 blur-0 grayscale-0"
            }
          `}
          style={{ transform: "translate3d(0, 0, 0)" }}
          placeholder="blur"
          blurDataURL={photo.blurDataUrl}
          src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_400,q_auto,f_auto/${photo.public_id}.${photo.format}`}
          width={400}
          height={267}
          onLoad={() => setIsLoading(false)}
          sizes="280px"
        />
      </div>
    </div>
  );
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
        <div className="row-span-1 h-full w-full rounded-2xl flex flex-col justify-start">
          <div className="mb-3">
            <p className="text-zinc-900 dark:text-white mb-1">
              Neal367&apos;s photos
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 ">
              a collection of my favorite memories.❣️
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Link
              href="https://github.com/neal367"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <Link
              href="https://twitter.com/NL367"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-blue-400 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={`/p/${photo.id}`}
            className="h-40 sm:h-48 lg:h-52 block cursor-zoom-in active:scale-[0.98] transition-all"
            scroll={false}
          >
            <PhotoCard photo={photo} />
          </Link>
        ))}
      </div>
    </div>
  );
}
