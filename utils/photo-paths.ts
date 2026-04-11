import type { PhotoProps } from "@/utils/types";

export type PhotoRouteParam = string | string[] | undefined;
const TOKEN_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function slugifyPathSegment(segment: string): string {
  const normalized = segment
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const slug = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "photo";
}

export function getPhotoIdFromRouteParam(routeParam: PhotoRouteParam): string | undefined {
  return Array.isArray(routeParam) ? routeParam.join("/") : routeParam;
}

function getLegacyPhotoRoutePath(publicId: string): string {
  return publicId
    .split("/")
    .map((segment) => slugifyPathSegment(segment))
    .join("/");
}

function encodeRouteToken(value: number): string {
  if (value === 0) {
    return TOKEN_ALPHABET[0].repeat(9);
  }

  let encoded = "";
  let current = value;

  while (current > 0) {
    encoded = TOKEN_ALPHABET[current % 64] + encoded;
    current = Math.floor(current / 64);
  }

  return encoded.padStart(9, TOKEN_ALPHABET[0]);
}

function getPhotoRouteToken(publicId: string): string {
  let h1 = 0xdeadbeef ^ publicId.length;
  let h2 = 0x41c6ce57 ^ publicId.length;

  for (const char of publicId) {
    const code = char.codePointAt(0) ?? 0;
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return encodeRouteToken(4294967296 * (2097151 & h2) + (h1 >>> 0));
}

export function getPhotoRoutePath(publicId: string): string {
  return getPhotoRouteToken(publicId);
}

export function getPhotoRouteSegments(publicId: string): string[] {
  return [getPhotoRoutePath(publicId)];
}

export function getPhotoHref(publicId: string): `/p/${string}` {
  return `/p/${getPhotoRouteSegments(publicId).join("/")}`;
}

export function isLegacyPhotoIndexParam(photoId: string | undefined): boolean {
  return Boolean(photoId && /^\d+$/.test(photoId));
}

export function isCanonicalPhotoRouteParam(
  routeParam: PhotoRouteParam,
  publicId: string
): boolean {
  return getPhotoIdFromRouteParam(routeParam) === getPhotoRoutePath(publicId);
}

export function doesPhotoRouteParamMatch(
  routeParam: PhotoRouteParam,
  publicId: string
): boolean {
  const routeValue = getPhotoIdFromRouteParam(routeParam);

  if (!routeValue) {
    return false;
  }

  return (
    routeValue === publicId ||
    routeValue === getPhotoRoutePath(publicId) ||
    routeValue === getLegacyPhotoRoutePath(publicId)
  );
}

export function findPhotoByRouteParam(
  routeParam: PhotoRouteParam,
  photos: PhotoProps[]
): PhotoProps | undefined {
  return photos.find((photo) => doesPhotoRouteParamMatch(routeParam, photo.id));
}

export function getPhotoIndexFromRouteParam(
  routeParam: PhotoRouteParam,
  photos: PhotoProps[]
): number {
  const photoId = getPhotoIdFromRouteParam(routeParam);

  if (!photoId) {
    return 0;
  }

  if (isLegacyPhotoIndexParam(photoId)) {
    const numericIndex = Number.parseInt(photoId, 10) - 1;
    if (numericIndex >= 0 && numericIndex < photos.length) {
      return numericIndex;
    }
  }

  const stableIndex = photos.findIndex((photo) => doesPhotoRouteParamMatch(routeParam, photo.id));
  return stableIndex >= 0 ? stableIndex : 0;
}
