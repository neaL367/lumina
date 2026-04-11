"use client";

import Image from "next/image";
import { useState } from "react";
import { cloudinaryLoader, getCloudinaryAssetPath } from "@/lib/cloudinary-images";
import type { PhotoProps } from "@/utils/types";

const PHOTO_IMAGE_SIZES = `(max-width: 768px) calc(100vw - 2rem), calc(100vw - 6rem)`;

export function Photo(props: { photo: PhotoProps }): React.JSX.Element {
    const [loading, setLoading] = useState(true);
    const assetPath = getCloudinaryAssetPath(props.photo.public_id, props.photo.format);

    return (
        <div className={`relative w-full h-full flex items-center justify-center`}>
            {loading ? (
                <div className={`absolute inset-0 flex items-center justify-center z-20`}>
                    <div className={`w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin`} />
                </div>
            ) : null}
            <Image
                loader={cloudinaryLoader}
                src={assetPath}
                alt={`Photo ${props.photo.id}`}
                fill
                priority
                loading="eager"
                placeholder={props.photo.blurDataUrl ? `blur` : `empty`}
                blurDataURL={props.photo.blurDataUrl}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                className={`object-contain transition-[opacity,transform,filter] duration-700 ease-in-out ${loading ? `opacity-70 scale-95 blur-md` : `opacity-100 scale-100 blur-0`
                    }`}
                sizes={PHOTO_IMAGE_SIZES}
            />
        </div>
    );
}
