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
const BLUR_DATA_LIMIT = 12;

async function getBase64ImageUrl(
    imageId: string,
    format: string
): Promise<string | undefined> {
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

async function getSortedPhotoResources(): Promise<CloudinaryResource[]> {
    const resources: CloudinaryResource[] = [];
    let nextCursor: string | undefined;

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
    } while (nextCursor);

    return sortResourcesByDateDesc(resources);
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
            // Safety: only generate blurs for the top rows to prevent timeouts on large galleries
            const resourcesToBlur = resources.slice(0, BLUR_DATA_LIMIT);
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
            blurDataUrl: (withBlur && i < BLUR_DATA_LIMIT) ? imagesWithBlurData[i] : undefined,
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

export async function getPhotoByRouteParam(routeParam: PhotoRouteParam): Promise<PhotoProps | null> {
    "use cache";
    cacheLife({
        stale: 3600,
        revalidate: 900,
        expire: 86400,
    });

    const photoId = getPhotoIdFromRouteParam(routeParam);
    if (!photoId) {
        return null;
    }

    if (isLegacyPhotoIndexParam(photoId)) {
        const numericIndex = Number.parseInt(photoId, 10) - 1;
        if (numericIndex < 0) {
            return null;
        }

        const photos = await getPhotos();
        return photos[numericIndex] ?? null;
    }

    const photos = await getPhotos();
    const matchedPhoto = findPhotoByRouteParam(routeParam, photos);
    if (matchedPhoto) {
        return matchedPhoto;
    }

    return getPhotoById(photoId);
}
