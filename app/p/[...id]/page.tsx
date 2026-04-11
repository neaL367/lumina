import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { XIcon } from "lucide-react";
import { Photo } from "@/components/photo";
import { getCloudinaryAssetPath, getCloudinaryImageUrl } from "@/lib/cloudinary-images";
import { getPhotoByRouteParam } from "@/lib/photos";
import { baseUrl } from "@/utils/constants";
import {
  getPhotoHref,
  isCanonicalPhotoRouteParam,
} from "@/utils/photo-paths";

export async function generateMetadata(props: PageProps<"/p/[...id]">): Promise<Metadata> {
  const { id } = await props.params;
  const currentPhoto = await getPhotoByRouteParam(id);

  if (!currentPhoto) {
    return {
      title: `Photo Not Found`,
    };
  }

  const stableHref = getPhotoHref(currentPhoto.public_id);
  const imageUrl = getCloudinaryImageUrl(
    getCloudinaryAssetPath(currentPhoto.public_id, currentPhoto.format),
    {
      fit: `scale`,
      width: 720,
    }
  );

  return {
    title: `Neal367's photos`,
    description: `a collection of my favorite memories.โฃ๏ธ`,
    alternates: {
      canonical: stableHref,
    },
    openGraph: {
      title: `Neal367's photos`,
      description: `a collection of my favorite memories.โฃ๏ธ`,
      url: `${baseUrl}${stableHref}`,
      images: [
        {
          url: imageUrl,
          width: 720,
          alt: `Neal367's photos`,
        },
      ],
    },
    twitter: {
      card: `summary_large_image`,
      title: `Neal367's photos`,
      description: `a collection of my favorite memories.โฃ๏ธ`,
      images: [imageUrl],
    },
  };
}

export default async function PhotoPage(
  props: PageProps<"/p/[...id]">
): Promise<React.JSX.Element> {
  const { id } = await props.params;
  const currentPhoto = await getPhotoByRouteParam(id);

  if (!currentPhoto) {
    return notFound();
  }

  if (!isCanonicalPhotoRouteParam(id, currentPhoto.public_id)) {
    redirect(getPhotoHref(currentPhoto.public_id));
  }

  return (
    <div className={`relative min-h-dvh w-full flex items-center justify-center bg-black/95 backdrop-blur-sm`}>
      <Link
        href={`/`}
        className={`absolute top-5 left-5 z-50 flex items-center gap-2 rounded-full bg-zinc-800/80 p-2.5 px-4 text-white transition-colors hover:cursor-pointer hover:bg-zinc-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
        aria-label={`Back to gallery`}
      >
        <XIcon className={`w-6 h-6`} />
        <span className={`font-medium`}>{`Back`}</span>
      </Link>

      <div className={`relative h-dvh w-full flex items-center justify-center`}>
        <div className={`relative h-full w-full p-4 md:p-12`}>
          <Photo photo={currentPhoto} />
        </div>
      </div>
    </div>
  );
}
