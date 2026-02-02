import { notFound } from "next/navigation";
import { Carousel } from "@/components/carousel";
import { getPhotos, getPhotoIds } from "@/lib/photos";

export async function generateStaticParams() {
    const photoIds = await getPhotoIds();

    if (!photoIds || photoIds.length === 0) {
        return [{ id: ["__placeholder__"] }];
    }

    return photoIds.map((photoId) => ({
        id: photoId.split("/"),
    }));
}

export default async function PhotoModal(props: PageProps<"/p/[...id]">) {
    const { id } = await props.params;
    const photoId = Array.isArray(id) ? id.join("/") : id;

    const photos = await getPhotos();
    const currentPhoto = photos.find((p) => p.id === photoId);

    if (!currentPhoto) return notFound();

    return (
        <Carousel
            index={photos.indexOf(currentPhoto)}
            currentPhoto={currentPhoto}
            photos={photos}
        />
    );
}
