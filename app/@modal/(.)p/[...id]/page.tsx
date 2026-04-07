import { notFound } from "next/navigation";
import { CarouselMain } from "@/components/carousel";
import { getPhotoIds } from "@/lib/photos";

export async function generateStaticParams() {
    const photoIds = await getPhotoIds();

    if (!photoIds || photoIds.length === 0) {
        return [{ id: ["__placeholder__"] }];
    }

    // Return indices for cleaner URLs
    return photoIds.map((_, index) => ({
        id: [(index + 1).toString()],
    }));
}

export default async function PhotoModal(props: PageProps<"/p/[...id]">) {
  const { id } = await props.params;
  if (!id) return notFound();

  return <CarouselMain />;
}
