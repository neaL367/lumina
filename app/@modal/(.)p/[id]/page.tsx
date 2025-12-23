import { notFound } from "next/navigation";
import Carousel from "@/components/carousel";
import { getPhotos } from "@/lib/cloudinary";

export async function generateStaticParams() {
  const photos = await getPhotos();

  if (!photos || photos.length === 0) {
    return [{ id: "__placeholder__" }];
  }

  return photos.map((photo) => ({
    id: String(photo.id),
  }));
}

export default async function PhotoModal({ params }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const photoId = Number(id);

  const photos = await getPhotos();
  const currentPhoto = photos.find((img) => img.id === photoId);
  if (!currentPhoto) return notFound();

  return (
    <Carousel
      index={photos.indexOf(currentPhoto)}
      currentPhoto={currentPhoto}
      photos={photos}
    />
  );
}
