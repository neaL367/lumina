import { cacheLife } from "next/cache";
import cloudinary from "./cloudinary";
import type { PhotoProps } from "@/utils/types";
import { CLOUD_NAME } from "@/utils/constants";

type CloudinaryResource = {
    public_id: string;
    format: string;
    height: number;
    width: number;
}

async function getBase64ImageUrl(
    imageId: string,
    format: string
): Promise<string | undefined> {
    try {
        const response = await fetch(
            `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_100,e_blur:1000,q_auto,f_webp/${imageId}.${format}`
        );

        if (!response.ok) {
            throw new Error(`Cloudinary fetch failed: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:image/webp;base64,${base64}`;
    } catch (e) {
        console.error(`Error generating blur data for ${imageId}:`, e);
        return undefined;
    }
}


export async function getPhotos(withBlur = true): Promise<PhotoProps[]> {
    "use cache";
    cacheLife({
        stale: 3600,
        revalidate: 900,
        expire: 86400,
    });

    try {
        const results = await cloudinary.search
            .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
            .sort_by("public_id", "desc")
            .max_results(400)
            .execute();

        let imagesWithBlurData: (string | undefined)[] = [];
        if (withBlur) {
            const blurImagePromises = results.resources.map((result: CloudinaryResource) => {
                return getBase64ImageUrl(result.public_id, result.format);
            });
            imagesWithBlurData = await Promise.all(blurImagePromises);
        }

        return results.resources.map((result: CloudinaryResource, i: number) => ({
            id: result.public_id,
            height: result.height,
            width: result.width,
            public_id: result.public_id,
            format: result.format,
            blurDataUrl: withBlur ? imagesWithBlurData[i] : undefined,
        }));
    } catch (error) {
        console.error("Error fetching photos from Cloudinary:", error);
        return [];
    }
}

export async function getPhotoById(id: string): Promise<PhotoProps | null> {
    "use cache";
    cacheLife({
        stale: 3600,
        revalidate: 900,
        expire: 86400,
    });


    try {
        const result = await cloudinary.api.resource(id);
        const blurDataUrl = await getBase64ImageUrl(result.public_id, result.format);

        return {
            id: result.public_id,
            height: result.height,
            width: result.width,
            public_id: result.public_id,
            format: result.format,
            blurDataUrl,
        };
    } catch (error) {
        console.error(`Error fetching photo ${id} from Cloudinary:`, error);
        return null;
    }
}

export async function getPhotoIds(): Promise<string[]> {
    "use cache";
    cacheLife({
        stale: 3600,
        revalidate: 900,
        expire: 86400,
    });


    try {
        const results = await cloudinary.search
            .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
            .sort_by("public_id", "desc")
            .max_results(400)
            .execute();

        return results.resources.map((result: { public_id: string }) => result.public_id);
    } catch (error) {
        console.error("Error fetching photo IDs from Cloudinary:", error);
        return [];
    }
}
