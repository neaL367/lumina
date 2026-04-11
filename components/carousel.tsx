"use client";

import { CarouselProvider } from "@/components/carousel-context";
import {
  CarouselActions,
  CarouselMain,
  CarouselNavigation,
  CarouselThumbnails,
} from "@/components/carousel-parts";
import type { PhotoProps } from "@/utils/types";

export { CarouselMain } from "@/components/carousel-parts";

export function Carousel(props: { children?: React.ReactNode; photos: PhotoProps[] }) {
  return (
    <CarouselProvider photos={props.photos}>
      <div className={`fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-zinc-950/95 backdrop-blur-2xl`}>
        <div className={`absolute right-0 top-0 z-50 flex justify-end p-4 md:p-6`}>
          <CarouselActions />
        </div>

        <div className={`relative flex min-h-0 flex-1 items-center justify-center p-4 md:p-8`}>
          {props.children ?? <CarouselMain />}
          <CarouselNavigation />
        </div>

        <div className={`w-full shrink-0 border-t border-white/5 bg-black/20 pb-2 md:pb-4`}>
          <CarouselThumbnails />
        </div>
      </div>
    </CarouselProvider>
  );
}
