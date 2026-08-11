import { Suspense, ViewTransition } from "react";
import { GalleryHeader } from "@/components/gallery/gallery-header";
import {
  GalleryContent,
  GalleryContentSkeleton,
} from "@/features/gallery/components/gallery-content";

export default function Home(): React.JSX.Element {
  return (
    <main className="w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950 relative overflow-hidden focus:outline-none">
      <GalleryHeader />
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
        <Suspense fallback={<GalleryContentSkeleton />}>
          <GalleryContent />
        </Suspense>
      </ViewTransition>
    </main>
  );
}
