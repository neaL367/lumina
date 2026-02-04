"use client";

import Image from "next/image";
import { useState } from "react";
import { CLOUD_NAME } from "@/utils/constants";
import type { PhotoProps } from "@/utils/types";

export function PhotoView({ photo }: { photo: PhotoProps }) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            )}
            <Image
                src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_1920,q_auto,f_auto/${photo.public_id}.${photo.format}`}
                alt={`Photo ${photo.id}`}
                fill
                priority
                onLoad={() => setLoading(false)}
                className={`object-contain transition-all duration-700 ease-in-out ${loading ? "opacity-0 scale-95 blur-md" : "opacity-100 scale-100 blur-0"
                    }`}
                sizes="(max-width: 1024px) 100vw, 1280px"
            />
        </div>
    );
}
