"use client";

import Image from "next/image";
import { useState } from "react";
import { CLOUD_NAME } from "@/utils/constants";
import type { PhotoProps } from "@/utils/types";

const getPhotoUrl = (publicId: string, format: string, width: number) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_limit,w_${width},dpr_auto,q_auto,f_auto/${publicId}.${format}`;
};

const PHOTO_IMAGE_SIZES = `(max-width: 768px) calc(100vw - 2rem), calc(100vw - 6rem)`;

export function Photo(props: { photo: PhotoProps }): React.JSX.Element {
    const [loading, setLoading] = useState(true);

    return (
        <div className={`relative w-full h-full flex items-center justify-center`}>
            {loading ? (
                <div className={`absolute inset-0 flex items-center justify-center z-20`}>
                    <div className={`w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin`} />
                </div>
            ) : null}
            <Image
                src={getPhotoUrl(props.photo.public_id, props.photo.format, 2560)}
                alt={`Photo ${props.photo.id}`}
                fill
                priority
                unoptimized
                loading="eager"
                onLoad={() => setLoading(false)}
                className={`object-contain transition-all duration-700 ease-in-out ${loading ? `opacity-0 scale-95 blur-md` : `opacity-100 scale-100 blur-0`
                    }`}
                sizes={PHOTO_IMAGE_SIZES}
            />
        </div>
    );
}
