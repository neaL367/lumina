import { Suspense, ViewTransition } from "react";
import { PhotoNav } from "@/components/photo-nav";
import {
  PhotoContent,
  PhotoContentSkeleton,
} from "@/features/photo/components/photo-content";

export default function PhotoPage({ params }: PageProps<"/p/[id]">) {
  return (
    <div className="w-full min-h-dvh bg-[#f3f3f3] pt-16 dark:bg-zinc-950 flex items-center justify-center sm:p-6 relative">
      <PhotoNav />
      <ViewTransition
        enter={{
          "nav-forward": "nav-forward",
          "nav-back": "nav-back",
          default: "none",
        }}
        exit={{
          "nav-forward": "nav-forward",
          "nav-back": "nav-back",
          default: "none",
        }}
        default="none"
      >
        <Suspense fallback={<PhotoContentSkeleton />}>
          {params.then(({ id }) => <PhotoContent id={id} />)}
        </Suspense>
      </ViewTransition>
    </div>
  );
}
