import { notFound } from "next/navigation";
import Image from "next/image";
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

export default async function PhotoPage({ params }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const photoId = Number(id);

  const photos = await getPhotos();
  const currentPhoto = photos.find((img) => img.id === photoId);

  if (!currentPhoto) {
    return notFound();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="relative w-full max-w-5xl aspect-3/2 mx-auto p-4">
        <Image
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_1280/${currentPhoto.public_id}.${currentPhoto.format}`}
          alt="Neal367 Photo"
          fill
          priority
          className="object-contain"
          blurDataURL={currentPhoto.blurDataUrl}
          placeholder="blur"
        />
      </div>
    </div>
  );
}
