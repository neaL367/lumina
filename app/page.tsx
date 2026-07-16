import { Gallery } from "@/components/gallery/gallery";
import { getPhotos } from "@/lib/photos";

export default async function Home(): Promise<React.JSX.Element> {
  const photos = await getPhotos(true);

  return (
    <main className={`w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950`}>
      <Gallery photos={photos} />
    </main>
  );
}
