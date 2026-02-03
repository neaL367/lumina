import Link from "next/link";
import { notFound } from "next/navigation";
import { XIcon } from "lucide-react";
import { getPhotoById, getPhotoIds } from "@/lib/photos";
import { baseUrl } from "@/utils/constants";
import { ProgressiveViewer } from "@/components/progressive-viewer";

export async function generateStaticParams() {
    const photoIds = await getPhotoIds();

    if (!photoIds || photoIds.length === 0) {
        return [{ id: ["__placeholder__"] }];
    }

    return photoIds.map((photoId) => ({
        id: photoId.split("/"),
    }));
}

export async function generateMetadata(props: PageProps<"/p/[...id]">) {
    const { id } = await props.params;
    const photoId = Array.isArray(id) ? id.join("/") : id;

    const currentPhoto = await getPhotoById(photoId);

    if (!currentPhoto) {
        return {
            title: "Photo Not Found",
        };
    }

    const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${currentPhoto.public_id}.${currentPhoto.format}`;

    return {
        title: "Neal367's photos",
        description: "a collection of my favorite memories.❣️",

        openGraph: {
            title: "Neal367's photos",
            description: "a collection of my favorite memories.❣️",
            url: `${baseUrl}/p/${photoId}`,
            images: [
                {
                    url: imageUrl,
                    width: 720,
                    alt: "Neal367's photos",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: "Neal367's photos",
            description: "a collection of my favorite memories.❣️",
            images: [imageUrl],
        },
    };
}

export default async function PhotoPage(props: PageProps<"/p/[...id]">) {
    const { id } = await props.params;
    const photoId = Array.isArray(id) ? id.join("/") : id;

    const currentPhoto = await getPhotoById(photoId);

    if (!currentPhoto) {
        return notFound();
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <Link
                href="/"
                className="absolute top-5 left-5 z-50 p-2 rounded-full bg-zinc-800/80 md:p-3 text-white transition hover:cursor-pointer hover:bg-zinc-600/80"
                aria-label="Back to gallery"
            >
                <XIcon className="w-6 h-6" />
            </Link>

            <div className="relative w-full h-screen flex items-center justify-center">
                <div className="relative w-full max-w-5xl h-full max-h-[90vh]">
                    <ProgressiveViewer photo={currentPhoto} />
                </div>
            </div>
        </div>
    );
}
