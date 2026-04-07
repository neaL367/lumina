import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Lumina Gallery",
        short_name: "Lumina",
        description: "A beautiful, modern photo gallery built with Next.js",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        // icons: [
        //     {
        //         src: "/icon.png",
        //         sizes: "192x192",
        //         type: "image/png",
        //     },
        //     {
        //         src: "/icon.png",
        //         sizes: "512x512",
        //         type: "image/png",
        //     },
        // ],
    };
}
