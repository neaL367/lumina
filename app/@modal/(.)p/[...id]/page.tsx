import { notFound } from "next/navigation";
import { getPhotos, getPhotoIds } from "@/lib/photos";

export async function generateStaticParams() {
    const photoIds = await getPhotoIds();

    if (!photoIds || photoIds.length === 0) {
        return [{ id: ["__placeholder__"] }];
    }

    // Return indices for cleaner URLs
    return photoIds.map((_, index) => ({
        id: [(index + 1).toString()],
    }));
}

export default async function PhotoModal(props: PageProps<"/p/[...id]">) {
    const { id } = await props.params;
    const paramId = Array.isArray(id) ? id.join("/") : id;

    const photos = await getPhotos();
    const numericIndex = parseInt(paramId, 10) - 1;
    const currentPhoto = (numericIndex >= 0 && numericIndex < photos.length)
        ? photos[numericIndex]
        : photos.find((p) => p.id === paramId);

    if (!currentPhoto) return notFound();

    return null;
}
