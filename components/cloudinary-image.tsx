"use client";

import Image from "next/image";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";

const GALLERY_CARD_SIZES = `(max-width: 640px) 560px, (max-width: 1024px) 700px, (max-width: 1920px) 1200px, 1600px`;

export function CloudinaryImage({ photo, eager = false }: { photo: PhotoProps; eager?: boolean }) {
  'use memo'
  const assetPath = getCloudinaryAssetPath(photo.publicId, photo.format);

  return (
    <Image
      alt={`Photo from Neal367's photography collection`}
      loader={cloudinaryLoader}
      src={assetPath}
      fill
      quality={90}
      loading={eager ? "eager" : "lazy"}
      placeholder={photo.blurDataUrl ? "blur" : "empty"}
      blurDataURL={photo.blurDataUrl}
      sizes={GALLERY_CARD_SIZES}
      className="object-cover"
    />
  );
}
