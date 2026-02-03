"use client";

import Image from "next/image";
import { useState } from "react";
import { PhotoProps } from "@/utils/types";

interface ProgressiveViewerProps {
    photo: PhotoProps;
}

export function ProgressiveViewer({ photo }: ProgressiveViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    return (
        <div className="relative w-full h-full">
            {/* Low-res placeholder */}
            <Image
                src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_200,q_10,f_auto/${photo.public_id}.${photo.format}`}
                alt=""
                fill
                className={`object-contain transition-opacity duration-1000 ${isLoaded ? "opacity-0 scale-105" : "opacity-100 scale-100 blur-lg"
                    }`}
                aria-hidden="true"
            />

            {/* High-res image */}
            <Image
                src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_1280,q_auto,f_auto/${photo.public_id}.${photo.format}`}
                alt={`Photo ${photo.id}`}
                fill
                priority
                onLoad={() => setIsLoaded(true)}
                className={`object-contain transition-all duration-1000 ease-in-out ${isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-md"
                    }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
            />
        </div>
    );
}
