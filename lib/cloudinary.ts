import { v2 as cloudinary } from "cloudinary";
import { cacheLife } from "next/cache";
import type { PhotoProps } from "@/utils/types";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

async function getBase64ImageUrl(
  imageId: string,
  format: string
): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_40,e_blur:400,q_auto,f_webp/${imageId}.${format}`
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/webp;base64,${base64}`;
  } catch (e) {
    console.error("Error generating blur data:", e);
    return undefined; // Fallback if fetch fails
  }
}

export async function getPhotos(): Promise<PhotoProps[]> {
  "use cache";
  cacheLife("hours");
  try {
    // Search for images in a specific folder (optional) or just all images
    // Adjust 'folder:my-gallery/*' to match your Cloudinary folder structure
    const results = await cloudinary.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    const reducedResults: PhotoProps[] = [];

    let i = 0;
    for (const result of results.resources) {
      // Generate the blur data
      const blurDataUrl = await getBase64ImageUrl(
        result.public_id,
        result.format
      );

      reducedResults.push({
        id: i,
        height: result.height,
        width: result.width,
        public_id: result.public_id,
        format: result.format,
        blurDataUrl: blurDataUrl,
      });
      i++;
    }

    return reducedResults;
  } catch (error) {
    console.error("Error fetching photos from Cloudinary:", error);
    return [];
  }
}
