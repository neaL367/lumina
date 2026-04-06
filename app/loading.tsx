import { GallerySkeleton } from "@/components/gallery-skeleton";

export default function Loading() {
  return (
    <main className="w-full h-dvh bg-zinc-50 dark:bg-black overflow-hidden flex items-center justify-center">
      <GallerySkeleton />
    </main>
  );
}
