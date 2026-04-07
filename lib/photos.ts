import { cacheLife } from "next/cache";
import cloudinary from "./cloudinary";
import type { PhotoProps } from "@/utils/types";
import { CLOUD_NAME } from "@/utils/constants";

type CloudinaryResource = {
    public_id: string;
    format: string;
    height: number;
    width: number;
    created_at: string;
}

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;
const SEARCH_EXPRESSION = `folder:${CLOUDINARY_FOLDER}/*`;

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
        const base64 = Buffer.from(buffer).toString(`base64`);
        return `data:image/webp;base64,${base64}`;
    } catch (e) {
        console.error(`Error generating blur data for ${imageId}:`, e);
        return undefined;
    }
}

function sortResourcesByDateDesc(resources: CloudinaryResource[]): CloudinaryResource[] {
    return [...resources].sort((a, b) => {
        const dateDelta = Date.parse(b.created_at) - Date.parse(a.created_at);
        if (dateDelta !== 0) {
            return dateDelta;
        }

        return b.public_id.localeCompare(a.public_id);
    });
}

async function getSortedPhotoResources(): Promise<CloudinaryResource[]> {
    const results = await cloudinary.search
        .expression(SEARCH_EXPRESSION ?? ``)
        .sort_by(`created_at`, `desc`)
        .max_results(400)
        .execute();

    return sortResourcesByDateDesc(results.resources as CloudinaryResource[]);
}

export async function getPhotos(withBlur = false): Promise<PhotoProps[]> {
    "use cache";
    cacheLife({
        stale: 3600,
        revalidate: 900,
        expire: 86400,
    });

    try {
        const resources = await getSortedPhotoResources();

        let imagesWithBlurData: (string | undefined)[] = [];
        if (withBlur) {
            // Safety: only generate blurs for the top 12 to prevent timeouts
            const resourcesToBlur = resources.slice(0, 12);
            const blurImagePromises = resourcesToBlur.map((result) => {
                return getBase64ImageUrl(result.public_id, result.format);
            });
            imagesWithBlurData = await Promise.all(blurImagePromises);
        }

        return resources.map((result, i: number) => ({
            id: result.public_id,
            height: result.height,
            width: result.width,
            public_id: result.public_id,
            format: result.format,
            createdAt: result.created_at,
            blurDataUrl: (withBlur && i < 12) ? imagesWithBlurData[i] : undefined,
        }));
    } catch (error) {
        console.error(`Error fetching photos from Cloudinary:`, error);
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
            createdAt: result.created_at,
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
        const resources = await getSortedPhotoResources();
        return resources.map((result) => result.public_id);
    } catch (error) {
        console.error(`Error fetching photo IDs from Cloudinary:`, error);
        return [];
    }
}
