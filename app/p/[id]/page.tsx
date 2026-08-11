import { Suspense } from "react";
import { PhotoNav } from "@/components/photo-nav";
import {
  PhotoContent,
  PhotoContentSkeleton,
} from "@/features/photo/components/photo-content";

export default function PhotoPage({ params }: PageProps<"/p/[id]">) {
  return (
    <div className="w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950 flex items-center justify-center sm:p-6 relative">
      <PhotoNav />
      <Suspense fallback={<PhotoContentSkeleton />}>
        {params.then(({ id }) => <PhotoContent id={id} />)}
      </Suspense>
    </div>
  );
}
