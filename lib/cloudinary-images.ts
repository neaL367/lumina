import type { ImageLoaderProps } from "next/image";
import { CLOUD_NAME } from "@/utils/constants";

type CloudinaryImageOptions = {
  format?: "auto" | "webp";
  fit?: "limit" | "scale";
  quality?: number;
  width?: number;
};

function encodePublicId(publicId: string): string {
  return publicId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function getCloudinaryAssetPath(publicId: string, format: string): string {
  return `${encodePublicId(publicId)}.${format}`;
}

export function getCloudinaryImageUrl(
  src: string,
  { format = "auto", fit = "limit", quality, width }: CloudinaryImageOptions = {}
): string {
  const transforms = [
    `c_${fit}`,
    width ? `w_${width}` : null,
    "dpr_auto",
    `q_${quality ?? "auto"}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${src}`;
}

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  return getCloudinaryImageUrl(src, {
    width,
    quality,
  });
}
