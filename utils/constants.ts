export const baseUrl = "https://lumina-khaki-delta.vercel.app";

const rawCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
if (!rawCloudName) {
  throw new Error(
    "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable. " +
    "Set it in .env.local or your deployment platform."
  );
}
export const CLOUD_NAME: string = rawCloudName;