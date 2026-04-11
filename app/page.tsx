import { Gallery } from "@/components/gallery";
import { getPhotos } from "@/lib/photos";

export default async function Home(): Promise<React.JSX.Element> {
  const photos = await getPhotos(true);

  return (
    <main className={`w-full h-dvh bg-zinc-50 dark:bg-black overflow-hidden`}>
      <Gallery photos={photos} />
    </main>
  );
}
