import { cache } from "react";
import { cacheLife } from "next/cache";
import cloudinary from "./cloudinary";
import { getCloudinaryAssetPath } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";
import { CLOUD_NAME } from "@/utils/constants";
import {
    findPhotoByRouteParam,
    getPhotoIdFromRouteParam,
    isLegacyPhotoIndexParam,
    type PhotoRouteParam,
} from "@/utils/photo-paths";

type CloudinaryResource = {
    public_id: string;
    format: string;
    height: number;
    width: number;
    created_at: string;
}

type SearchResults = {
    next_cursor?: string;
    resources: CloudinaryResource[];
};

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;
const SEARCH_EXPRESSION = CLOUDINARY_FOLDER ? `folder:${CLOUDINARY_FOLDER}/*` : ``;
const CLOUDINARY_SEARCH_PAGE_SIZE = 500;
const CLOUDINARY_MAX_PAGES = 4;
const BLUR_DATA_LIMIT = 12;

async function getBase64ImageUrl(
    imageId: string,
    format: string
): Promise<string | undefined> {
    "use cache";
    cacheLife('blurData');

    try {
        const response = await fetch(
            `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_100,e_blur:1000,q_auto,f_webp/${getCloudinaryAssetPath(imageId, format)}`
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

const getSortedPhotoResources = cache(async function getSortedPhotoResources(): Promise<CloudinaryResource[]> {
    const resources: CloudinaryResource[] = [];
    let nextCursor: string | undefined;
    let pageCount = 0;

    do {
        const search = cloudinary.search
            .expression(SEARCH_EXPRESSION)
            .sort_by(`created_at`, `desc`)
            .max_results(CLOUDINARY_SEARCH_PAGE_SIZE);

        if (nextCursor) {
            search.next_cursor(nextCursor);
        }

        const results = await search.execute() as SearchResults;

        resources.push(...results.resources);
        nextCursor = results.next_cursor;
        pageCount++;
    } while (nextCursor && pageCount < CLOUDINARY_MAX_PAGES);

    return sortResourcesByDateDesc(resources);
});

export async function getPhotos(withBlur = false): Promise<PhotoProps[]> {
    "use cache";
    cacheLife('gallery');

    try {
        const resources = await getSortedPhotoResources();

        if (resources.length === 0) {
            console.warn("No photos found in Cloudinary folder");
        }

        let imagesWithBlurData: (string | undefined)[] = [];
        if (withBlur) {
            const resourcesToBlur = resources.slice(0, BLUR_DATA_LIMIT);
            const blurImageUrls: string[] = resourcesToBlur.map((result) => {
                return getCloudinaryAssetPath(result.public_id, result.format);
            });
            const blurImagePromises = blurImageUrls.map((url) => {
                const match = url.match(/upload\/([^\/]+)\.(.+)$/);
                if (!match) {
                    return undefined;
                }
                return getBase64ImageUrl(match[1], match[2]);
            });
            imagesWithBlurData = await Promise.all(blurImagePromises);
        }

        return resources.map((result, i: number) => ({
            publicId: result.public_id,
            height: result.height,
            width: result.width,
            format: result.format,
            createdAt: result.created_at,
            blurDataUrl: (withBlur && i < BLUR_DATA_LIMIT) ? imagesWithBlurData[i] : undefined,
        }));
    } catch (error) {
        console.error(`Error fetching photos from Cloudinary:`, error);
        return [];
    }
}

export async function getPhotoById(id: string): Promise<PhotoProps | null> {
    "use cache";
    cacheLife('photos');


    try {
        const result = await cloudinary.api.resource(id);
        const blurDataUrl = await getBase64ImageUrl(result.public_id, result.format);

        return {
            publicId: result.public_id,
            height: result.height,
            width: result.width,
            format: result.format,
            createdAt: result.created_at,
            blurDataUrl,
        };
    } catch (error) {
        console.error(`Error fetching photo ${id} from Cloudinary:`, error);
        return null;
    }
}

export async function getPhotoByRouteParam(routeParam: PhotoRouteParam): Promise<PhotoProps | null> {
    "use cache";
    cacheLife('photos');

    const photoId = getPhotoIdFromRouteParam(routeParam);
    if (!photoId) {
        return null;
    }

    const photos = await getPhotos();
    
    if (isLegacyPhotoIndexParam(photoId)) {
        const numericIndex = Number.parseInt(photoId, 10) - 1;
        if (numericIndex < 0) {
            return null;
        }
        return photos[numericIndex] ?? null;
    }

    const matchedPhoto = findPhotoByRouteParam(routeParam, photos);
    if (matchedPhoto) {
        return matchedPhoto;
    }

    return getPhotoById(photoId);
}
