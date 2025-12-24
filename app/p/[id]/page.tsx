import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { getPhotos } from "@/lib/cloudinary";
import { baseUrl } from "@/utils/constants";

export async function generateStaticParams() {
  const photos = await getPhotos();

  if (!photos || photos.length === 0) {
    return [{ id: "__placeholder__" }];
  }

  return photos.map((photo) => ({
    id: String(photo.id),
  }));
}

export async function generateMetadata({ params }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const photoId = Number(id);

  const photos = await getPhotos();
  const currentPhoto = photos.find((img) => img.id === photoId);

  if (!currentPhoto) {
    return {
      title: "Photo Not Found",
    };
  }

  const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${currentPhoto.public_id}.${currentPhoto.format}`;

  return {
    title: "Neal367's photos",
    description: "a collection of my favorite memories.❣️",

    openGraph: {
      title: "Neal367's photos",
      description: "a collection of my favorite memories.❣️",
      url: `${baseUrl}/p/${photoId}`,
      images: [
        {
          url: imageUrl,
          width: 720,
          alt: "Neal367's photos",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Neal367's photos",
      description: "a collection of my favorite memories.❣️",
      images: [imageUrl],
    },
  };
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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 p-2 rounded-full bg-zinc-800/80 md:p-3 text-white transition hover:cursor-pointer hover:bg-zinc-600/80"
        aria-label="Back to gallery"
      >
        <XIcon className="w-6 h-6" />
      </Link>

      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="relative w-full max-w-5xl h-full max-h-[90vh]">
          <Image
            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_1280/${currentPhoto.public_id}.${currentPhoto.format}`}
            alt={`Photo ${currentPhoto.id}`}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
            blurDataURL={currentPhoto.blurDataUrl}
            placeholder="blur"
          />
        </div>
      </div>
    </div>
  );
}
